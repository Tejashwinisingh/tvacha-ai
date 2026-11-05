
from sqlalchemy import inspect
from app.db.database import engine

inspector = inspect(engine)

tables = inspector.get_table_names()

print("Connected database: tvachaai_db")
print("Available tables:", tables)

if "users" in tables:
    print("SUCCESS: users table exists!")
    print("Columns:")
    for column in inspector.get_columns("users"):
        print(column["name"], "-", column["type"])
else:
    print("users table not found.")
