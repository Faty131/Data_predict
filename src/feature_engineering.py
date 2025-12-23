import pandas as pd

def encode_features(df):
    df = df.copy()

    categorical_cols = ["TransportType", "Line", "Status", "IncidentCause"]

    df = pd.get_dummies(df, columns=categorical_cols, drop_first=True)

    return df
