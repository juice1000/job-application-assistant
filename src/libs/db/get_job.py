from os import path, walk

from sqlmodel import Session, select

from libs.db.init_db import Job, engine
from libs.logger.init_logger import logger


def get_job_files():
    """
    Get all .txt files from the 'data' folder and return their paths.

    Returns:
        list: A list of file paths for all .txt files in the 'data' folder.
    """
    data_folder = "data"
    txt_files = []

    # Walk through the data folder and collect all .txt files
    for root, dirs, files in walk(data_folder):
        for file in files:
            if file.endswith(".txt"):
                txt_files.append(path.join(root, file))

    return txt_files


def get_job_by_url(url):
    logger.info(f"Retrieving job by URL: {url}")
    with Session(engine) as session:
        statement = select(Job).where(Job.url == url)
        return session.exec(statement).first()


def get_all_jobs():
    logger.info("Retrieving all jobs from DB...")
    """
    Get all jobs from the database.

    Returns:
        list: A list of all jobs in the database.
    """
    if not engine:
        raise Exception("No Engine for DB found")
    with Session(engine) as session:
        statement = select(Job)
        jobs = session.exec(statement).all()
        logger.info(f"Number of Jobs retrieved: {len(jobs)}")
        return jobs


def get_jobs_without_application():
    logger.info("Retrieving all jobs without applications from DB...")
    """
    Get all jobs from the database that don't have an application yet.

    Returns:
        list: A list of jobs without applications.
    """
    if not engine:
        raise Exception("No Engine for DB found")
    with Session(engine) as session:
        statement = select(Job).where(Job.application_letter.is_(None))
        jobs = session.exec(statement).all()
        logger.info(f"Number of Jobs without applications retrieved: {len(jobs)}")
        return jobs
