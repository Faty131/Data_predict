# 🚍 SmartMobility ML - Public Transport Delay Prediction

[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-green.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18.2+-blue.svg)](https://reactjs.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A comprehensive machine learning system for predicting and analyzing public transport delays in real-time. This project combines advanced ML models, a modern web interface, and robust analytics to help transportation authorities optimize operations and improve passenger experience.

## 🌟 Key Features

### 🤖 Machine Learning Models
- **Random Forest**: High-accuracy ensemble model for delay prediction
- **XGBoost**: Gradient boosting model optimized for performance
- **Linear Regression**: Lightweight baseline model
- **Model Comparison**: Automated evaluation and selection of best performing model

### 📊 Analytics Dashboard
- **Temporal Analysis**: Delay patterns by hour of day
- **Weather Impact**: How weather conditions affect delays
- **Event Analysis**: Impact of special events on transport reliability
- **Transport Type Distribution**: Performance across different transport modes

### 🔄 Real-time Prediction
- **RESTful API**: FastAPI-based prediction service
- **Multi-model Support**: Choose between different ML models
- **Risk Assessment**: Automatic risk level calculation (Low/Medium/High)
- **Probability Estimation**: Confidence scores for predictions

### 📈 History & Comparison
- **Prediction History**: Complete audit trail of all predictions
- **Model Performance Tracking**: Historical accuracy metrics
- **Data Export**: CSV export functionality
- **Filtering & Search**: Advanced querying capabilities

### 🎨 Modern Web Interface
- **Responsive Design**: Works on desktop and mobile devices
- **Interactive Charts**: Real-time data visualization with Recharts
- **Dark/Light Theme**: User preference support
- **Intuitive Navigation**: Clean, modern UI with React Router

## 🏗️ Architecture

```
smartmobility-ml/
├── 📁 data/                    # Raw and processed datasets
│   ├── raw/                   # Original transport incident data
│   └── processed/             # Cleaned and engineered features
├── 📁 models/                 # Trained ML models and metadata
├── 📁 src/                    # Core Python modules
│   ├── preprocessing.py       # Data cleaning and validation
│   ├── feature_engineering.py # Feature creation and encoding
│   ├── modeling.py           # ML model training and evaluation
│   └── evaluation.py         # Model performance metrics
├── 📁 frontend/               # React web application
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/            # Main application pages
│   │   └── App.jsx           # Main application component
│   └── package.json          # Frontend dependencies
├── 📁 notebooks/              # Jupyter analysis notebooks
├── 📁 results/                # Model evaluation results and plots
├── api.py                     # FastAPI application
├── database.py                # SQLite database operations
├── main.py                    # Main training pipeline
└── requirements.txt           # Python dependencies
```

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd public-transport-delay-prediction
   ```

2. **Backend Setup**
   ```bash
   # Install Python dependencies
   pip install -r requirements.txt

   # (Optional) Install API-specific dependencies
   pip install -r requirements_api.txt
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

4. **Automated Setup (Alternative)**
   ```bash
   # Run the complete setup script
   ./setup_and_run.sh
   ```

### Training Models

```bash
# Train all models and generate evaluation reports
python main.py

# Or use the dedicated training script
python train_model.py
```

### Running the Application

1. **Start the API Server**
   ```bash
   # Option 1: Using Python directly
   python api.py

   # Option 2: Using the startup script
   ./start_api.sh
   ```
   The API will be available at `http://localhost:8000`

2. **Start the Frontend**
   ```bash
   cd frontend
   npm run dev
   ```
   The web interface will be available at `http://localhost:5173`

3. **Start History System (Optional)**
   ```bash
   ./start_history_system.sh
   ```

## 📖 Usage

### Making Predictions

#### Via API
```bash
curl -X POST "http://localhost:8000/predict" \
  -H "Content-Type: application/json" \
  -d '{
    "TransportType": "Metro",
    "Line": "Line1",
    "Hour": 8,
    "Day": "Lundi",
    "Weather": "Soleil",
    "Event": "Non",
    "model_type": "random_forest"
  }'
```

#### Via Web Interface
1. Open `http://localhost:5173` in your browser
2. Navigate to the "Prediction" page
3. Fill in the transport details
4. Select your preferred model
5. Click "Predict Delay"

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | API information and available endpoints |
| `GET` | `/health` | Health check and model status |
| `GET` | `/models` | List available ML models |
| `POST` | `/predict` | Make delay prediction |
| `GET` | `/analytics/temporal` | Temporal delay analysis |
| `GET` | `/analytics/weather` | Weather impact analysis |
| `GET` | `/analytics/events` | Event impact analysis |
| `GET` | `/analytics/transport` | Transport type analysis |
| `GET` | `/analytics/overview` | System overview metrics |
| `GET` | `/history` | Prediction history with filtering |
| `GET` | `/comparison` | Model comparison metrics |

### Example API Response
```json
{
  "delay": 12.5,
  "risk": "Moyen",
  "probability": 65.3,
  "model_used": "random_forest",
  "unit": "minutes",
  "prediction_id": 123,
  "timestamp": "2024-01-15T10:30:00",
  "input": {
    "TransportType": "Metro",
    "Line": "Line1",
    "Hour": 8,
    "Day": "Lundi",
    "Weather": "Soleil",
    "Event": "Non",
    "model_type": "random_forest"
  }
}
```

## 📊 Data Analysis

### Dataset Overview
- **54,000+ incidents** from public transport operations
- **Features**: Transport type, line, time, weather, events, incident causes
- **Target**: Delay duration in minutes

### Exploratory Analysis
Run the Jupyter notebooks for detailed analysis:
```bash
cd notebooks
jupyter notebook 01_data_cleaning.ipynb
jupyter notebook 02_exploratory_analysis.ipynb
jupyter notebook 03_feature_engineering.ipynb
jupyter notebook 04_modeling.ipynb
```

## 🧪 Testing

### Backend Tests
```bash
# Test the API
python test_api.py

# Test multiple models
python test_multi_models.py

# Test history and comparison features
python test_history_and_comparison.py
```

### Verification
```bash
# Run comprehensive verification
python verify_history_system.py
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file for custom configuration:
```env
API_HOST=0.0.0.0
API_PORT=8000
DATABASE_PATH=predictions_history.db
MODEL_PATH=./models/
```

### Model Configuration
Models are automatically loaded from the `models/` directory. Supported formats:
- `.pkl` (scikit-learn models)
- Feature information stored in `feature_info.pkl`

## 📈 Model Performance

| Model | RMSE | MAE | R² | Training Time |
|-------|------|-----|----|---------------|
| Random Forest | 3.24 | 2.18 | 0.87 | ~15s |
| XGBoost | 3.12 | 2.05 | 0.89 | ~8s |
| Linear Regression | 4.56 | 3.21 | 0.72 | ~2s |

*Performance metrics based on test dataset*

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow PEP 8 for Python code
- Use ESLint for JavaScript/React code
- Add tests for new features
- Update documentation

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

**Made with ❤️ for better public transportation**
