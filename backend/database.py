from sqlmodel import SQLModel, create_engine

DATABASE_URL = "postgresql://urbanmesh_user:urbanmesh_pass@localhost:5432/urbanmesh_db"

engine = create_engine(DATABASE_URL, echo=True)

def init_db():
    SQLModel.metadata.create_all(engine)