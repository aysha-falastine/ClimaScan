"""
Add user_id to properties and rename user -> users
Revision ID: 0001_add_user_id_and_rename_user
Revises: 
Create Date: 2025-10-28 00:00:00.000000
"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '0001_add_user_id_and_rename_user'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    conn = op.get_bind()
    # Rename table 'user' to 'users' if it exists
    insp = sa.inspect(conn)
    if 'user' in insp.get_table_names() and 'users' not in insp.get_table_names():
        op.execute('ALTER TABLE user RENAME TO users')

    # Add user_id column to properties if missing
    if 'properties' in insp.get_table_names():
        cols = [c['name'] for c in insp.get_columns('properties')]
        if 'user_id' not in cols:
            op.add_column('properties', sa.Column('user_id', sa.Integer(), nullable=True))
            # set a default user (NULLable for safety) - callers should populate appropriately
            # Create a simple FK constraint if users table exists
            if 'users' in insp.get_table_names():
                op.create_foreign_key('fk_properties_user_id_users', 'properties', 'users', ['user_id'], ['id'])


def downgrade():
    insp = sa.inspect(op.get_bind())
    if 'properties' in insp.get_table_names():
        cols = [c['name'] for c in insp.get_columns('properties')]
        if 'user_id' in cols:
            # drop FK if exists
            try:
                op.drop_constraint('fk_properties_user_id_users', 'properties', type_='foreignkey')
            except Exception:
                pass
            op.drop_column('properties', 'user_id')

    if 'users' in insp.get_table_names() and 'user' not in insp.get_table_names():
        # rename back to user
        op.execute('ALTER TABLE users RENAME TO user')
