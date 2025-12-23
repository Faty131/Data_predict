from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from xgboost import XGBRegressor

def split_data(df, target="delay_minutes"):
    X = df.drop(columns=[target])
    y = df[target]

    return train_test_split(X, y, test_size=0.2, random_state=42)

def train_random_forest(X_train, y_train):
    model = RandomForestRegressor(
        n_estimators=200,
        random_state=42,
        n_jobs=-1
    )
    model.fit(X_train, y_train)
    return model

def train_xgboost(X_train, y_train):
    model = XGBRegressor(
        n_estimators=300,
        learning_rate=0.05,
        max_depth=6,
        objective="reg:squarederror",
        random_state=42
    )
    model.fit(X_train, y_train)
    return model
