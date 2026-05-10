from DataBase.connect import engine
import sqlalchemy
from models import metadata_obj


def create_table():
    
    metadata_obj.create_all()
