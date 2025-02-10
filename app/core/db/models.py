from sqlalchemy import Column, Integer, String, ForeignKey, Text, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.db.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False)

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255), nullable=False, unique=True)
    root_directory_id = Column(Integer, ForeignKey("directories.id", ondelete="SET NULL"), nullable=True)

    root_directory = relationship("Directory", foreign_keys=[root_directory_id], post_update=True)
    collaborations = relationship("Collaboration", back_populates="project", cascade="all, delete")

class Directory(Base):
    __tablename__ = "directories"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    parent_directory_id = Column(Integer, ForeignKey("directories.id", ondelete="CASCADE"), nullable=True)

    parent_directory = relationship("Directory", remote_side=[id], back_populates="subdirectories")
    subdirectories = relationship("Directory", back_populates="parent_directory", cascade="all, delete-orphan")
    files = relationship("File", back_populates="directory", cascade="all, delete-orphan")

class File(Base):
    __tablename__ = "files"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    content = Column(Text, nullable=True)
    directory_id = Column(Integer, ForeignKey("directories.id", ondelete="CASCADE"), nullable=True)

    directory = relationship("Directory", back_populates="files")


class Collaboration(Base):
    __tablename__ = "collaborations"

    id = Column(Integer, primary_key=True, autoincrement=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    user_id = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    project = relationship("Project", back_populates="collaborations")
