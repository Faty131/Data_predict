from src.preprocessing import load_data, clean_data, save_clean_data
from src.feature_engineering import encode_features
from src.modeling import split_data, train_random_forest, train_xgboost
from src.evaluation import evaluate_model

RAW_PATH = "data/raw/transport_incidents.csv"
CLEAN_PATH = "data/processed/clean_data.csv"

def main():
    df = load_data(RAW_PATH)
    df = clean_data(df)
    save_clean_data(df, CLEAN_PATH)

    df = encode_features(df)

    X_train, X_test, y_train, y_test = split_data(df)

    rf_model = train_random_forest(X_train, y_train)
    xgb_model = train_xgboost(X_train, y_train)

    print("Random Forest:", evaluate_model(rf_model, X_test, y_test))
    print("XGBoost:", evaluate_model(xgb_model, X_test, y_test))

if __name__ == "__main__":
    main()
