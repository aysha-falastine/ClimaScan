from app import create_app
from app.database.db import db
from sqlalchemy import inspect

app = create_app()

with app.app_context():
    inspector = inspect(db.engine)
    
    print("\n=== DATABASE TABLES ===\n")
    
    for table_name in inspector.get_table_names():
        print(f"\n📊 {table_name.upper()}")
        print("-" * 60)
        
        for column in inspector.get_columns(table_name):
            nullable = "NULL" if column['nullable'] else "NOT NULL"
            print(f"  {column['name']:<25} {str(column['type']):<20} {nullable}")