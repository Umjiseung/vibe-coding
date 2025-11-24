from app import create_app
from extensions import db


def init_db():
    app = create_app()
    with app.app_context():
        db.create_all()
        print('Database tables created (via db.create_all()).')


if __name__ == '__main__':
    init_db()
