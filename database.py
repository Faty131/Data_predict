"""
Database models and configuration for storing prediction history and model comparisons.
"""
import sqlite3
from datetime import datetime
from typing import Optional, List
from dataclasses import asdict
import json

# Database configuration
DB_PATH = "./predictions_history.db"


class PredictionRecord:
    """Represents a prediction record in the database."""
    
    def __init__(
        self,
        transport_type: str,
        line: str,
        hour: int,
        day: str,
        weather: str,
        event: str,
        model_used: str,
        predicted_delay: float,
        predicted_risk: str,
        predicted_probability: float,
        actual_delay: Optional[float] = None,
        actual_risk: Optional[str] = None,
        id: Optional[int] = None,
        timestamp: Optional[str] = None
    ):
        self.id = id
        self.transport_type = transport_type
        self.line = line
        self.hour = hour
        self.day = day
        self.weather = weather
        self.event = event
        self.model_used = model_used
        self.predicted_delay = predicted_delay
        self.predicted_risk = predicted_risk
        self.predicted_probability = predicted_probability
        self.actual_delay = actual_delay
        self.actual_risk = actual_risk
        self.timestamp = timestamp or datetime.now().isoformat()
    
    def to_dict(self):
        """Convert to dictionary for JSON serialization."""
        return {
            'id': self.id,
            'transport_type': self.transport_type,
            'line': self.line,
            'hour': self.hour,
            'day': self.day,
            'weather': self.weather,
            'event': self.event,
            'model_used': self.model_used,
            'predicted_delay': self.predicted_delay,
            'predicted_risk': self.predicted_risk,
            'predicted_probability': self.predicted_probability,
            'actual_delay': self.actual_delay,
            'actual_risk': self.actual_risk,
            'timestamp': self.timestamp
        }


class Database:
    """Handles all database operations for prediction history."""
    
    def __init__(self, db_path: str = DB_PATH):
        self.db_path = db_path
        self.init_db()
    
    def get_connection(self):
        """Get a database connection."""
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn
    
    def init_db(self):
        """Initialize database tables if they don't exist."""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        # Create predictions table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS predictions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                transport_type TEXT NOT NULL,
                line TEXT NOT NULL,
                hour INTEGER NOT NULL,
                day TEXT NOT NULL,
                weather TEXT NOT NULL,
                event TEXT NOT NULL,
                model_used TEXT NOT NULL,
                predicted_delay REAL NOT NULL,
                predicted_risk TEXT NOT NULL,
                predicted_probability REAL NOT NULL,
                actual_delay REAL,
                actual_risk TEXT,
                timestamp TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Create model metrics table (daily aggregated stats)
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS model_metrics (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                model_name TEXT NOT NULL,
                date TEXT NOT NULL,
                total_predictions INTEGER DEFAULT 0,
                avg_prediction REAL,
                min_prediction REAL,
                max_prediction REAL,
                mae REAL,
                rmse REAL,
                r2_score REAL,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(model_name, date)
            )
        ''')
        
        conn.commit()
        conn.close()
    
    def save_prediction(self, record: PredictionRecord) -> int:
        """Save a prediction record to the database."""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO predictions (
                transport_type, line, hour, day, weather, event,
                model_used, predicted_delay, predicted_risk, predicted_probability,
                actual_delay, actual_risk, timestamp
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            record.transport_type,
            record.line,
            record.hour,
            record.day,
            record.weather,
            record.event,
            record.model_used,
            record.predicted_delay,
            record.predicted_risk,
            record.predicted_probability,
            record.actual_delay,
            record.actual_risk,
            record.timestamp
        ))
        
        prediction_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        return prediction_id
    
    def get_prediction(self, prediction_id: int) -> Optional[PredictionRecord]:
        """Get a single prediction by ID."""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('SELECT * FROM predictions WHERE id = ?', (prediction_id,))
        row = cursor.fetchone()
        conn.close()
        
        if not row:
            return None
        
        return PredictionRecord(
            id=row['id'],
            transport_type=row['transport_type'],
            line=row['line'],
            hour=row['hour'],
            day=row['day'],
            weather=row['weather'],
            event=row['event'],
            model_used=row['model_used'],
            predicted_delay=row['predicted_delay'],
            predicted_risk=row['predicted_risk'],
            predicted_probability=row['predicted_probability'],
            actual_delay=row['actual_delay'],
            actual_risk=row['actual_risk'],
            timestamp=row['timestamp']
        )
    
    def get_history(
        self,
        limit: int = 100,
        offset: int = 0,
        model_filter: Optional[str] = None,
        transport_filter: Optional[str] = None,
        day_filter: Optional[str] = None
    ) -> tuple[List[PredictionRecord], int]:
        """Get prediction history with optional filters and pagination."""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        # Build query
        query = 'SELECT * FROM predictions WHERE 1=1'
        params = []
        
        if model_filter:
            query += ' AND model_used = ?'
            params.append(model_filter)
        
        if transport_filter:
            query += ' AND transport_type = ?'
            params.append(transport_filter)
        
        if day_filter:
            query += ' AND day = ?'
            params.append(day_filter)
        
        # Get total count
        count_query = query.replace('SELECT *', 'SELECT COUNT(*) as count')
        cursor.execute(count_query, params)
        total = cursor.fetchone()['count']
        
        # Get paginated results
        query += ' ORDER BY timestamp DESC LIMIT ? OFFSET ?'
        params.extend([limit, offset])
        
        cursor.execute(query, params)
        rows = cursor.fetchall()
        conn.close()
        
        records = [
            PredictionRecord(
                id=row['id'],
                transport_type=row['transport_type'],
                line=row['line'],
                hour=row['hour'],
                day=row['day'],
                weather=row['weather'],
                event=row['event'],
                model_used=row['model_used'],
                predicted_delay=row['predicted_delay'],
                predicted_risk=row['predicted_risk'],
                predicted_probability=row['predicted_probability'],
                actual_delay=row['actual_delay'],
                actual_risk=row['actual_risk'],
                timestamp=row['timestamp']
            )
            for row in rows
        ]
        
        return records, total
    
    def get_model_statistics(self, model_name: Optional[str] = None) -> dict:
        """Get statistics for model(s)."""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        if model_name:
            # Stats for specific model
            cursor.execute('''
                SELECT 
                    model_used,
                    COUNT(*) as total_predictions,
                    AVG(predicted_delay) as avg_predicted_delay,
                    MIN(predicted_delay) as min_predicted_delay,
                    MAX(predicted_delay) as max_predicted_delay,
                    AVG(predicted_probability) as avg_confidence,
                    COUNT(CASE WHEN actual_delay IS NOT NULL THEN 1 END) as verified_predictions
                FROM predictions
                WHERE model_used = ?
                GROUP BY model_used
            ''', (model_name,))
        else:
            # Stats for all models
            cursor.execute('''
                SELECT 
                    model_used,
                    COUNT(*) as total_predictions,
                    AVG(predicted_delay) as avg_predicted_delay,
                    MIN(predicted_delay) as min_predicted_delay,
                    MAX(predicted_delay) as max_predicted_delay,
                    AVG(predicted_probability) as avg_confidence,
                    COUNT(CASE WHEN actual_delay IS NOT NULL THEN 1 END) as verified_predictions
                FROM predictions
                GROUP BY model_used
            ''')
        
        rows = cursor.fetchall()
        conn.close()
        
        stats = {}
        for row in rows:
            model = row['model_used']
            stats[model] = {
                'model_used': model,
                'total_predictions': row['total_predictions'],
                'avg_predicted_delay': round(row['avg_predicted_delay'], 2) if row['avg_predicted_delay'] else 0,
                'min_predicted_delay': round(row['min_predicted_delay'], 2) if row['min_predicted_delay'] else 0,
                'max_predicted_delay': round(row['max_predicted_delay'], 2) if row['max_predicted_delay'] else 0,
                'avg_confidence': round(row['avg_confidence'], 4) if row['avg_confidence'] else 0,
                'verified_predictions': row['verified_predictions']
            }
        
        return stats
    
    def get_model_comparison(self) -> dict:
        """Get detailed comparison between all models."""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        # Get usage stats
        cursor.execute('''
            SELECT 
                model_used,
                COUNT(*) as usage_count,
                AVG(predicted_delay) as avg_delay
            FROM predictions
            GROUP BY model_used
        ''')
        
        stats = {}
        for row in cursor.fetchall():
            model = row['model_used']
            stats[model] = {
                'usage_count': row['usage_count'],
                'avg_delay': round(row['avg_delay'], 2) if row['avg_delay'] else 0
            }
        
        # Get performance by risk level
        cursor.execute('''
            SELECT 
                model_used,
                predicted_risk,
                COUNT(*) as count,
                AVG(predicted_probability) as avg_confidence
            FROM predictions
            GROUP BY model_used, predicted_risk
        ''')
        
        risk_analysis = {}
        for row in cursor.fetchall():
            model = row['model_used']
            risk = row['predicted_risk']
            if model not in risk_analysis:
                risk_analysis[model] = {}
            risk_analysis[model][risk] = {
                'count': row['count'],
                'avg_confidence': round(row['avg_confidence'], 4)
            }
        
        conn.close()
        
        return {
            'statistics': stats,
            'risk_analysis': risk_analysis,
            'timestamp': datetime.now().isoformat()
        }
    
    def update_actual_delay(self, prediction_id: int, actual_delay: float, actual_risk: str):
        """Update a prediction with actual delay data."""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            UPDATE predictions
            SET actual_delay = ?, actual_risk = ?
            WHERE id = ?
        ''', (actual_delay, actual_risk, prediction_id))
        
        conn.commit()
        conn.close()
    
    def export_to_csv(self, filename: str = "predictions_export.csv"):
        """Export all predictions to CSV."""
        import csv
        
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM predictions ORDER BY timestamp DESC')
        rows = cursor.fetchall()
        conn.close()
        
        if not rows:
            return False
        
        with open(filename, 'w', newline='', encoding='utf-8') as f:
            writer = csv.DictWriter(f, fieldnames=[description[0] for description in cursor.description])
            writer.writeheader()
            for row in rows:
                writer.writerow(dict(row))
        
        return True
    
    def clear_old_predictions(self, days: int = 30):
        """Clear predictions older than specified days."""
        from datetime import timedelta, datetime
        
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cutoff_date = (datetime.now() - timedelta(days=days)).isoformat()
        cursor.execute(
            'DELETE FROM predictions WHERE timestamp < ?',
            (cutoff_date,)
        )
        
        deleted = cursor.rowcount
        conn.commit()
        conn.close()
        
        return deleted


# Initialize global database instance
db = Database()
