import asyncio
import logging
from app.db.init_db import init

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def run_migrations():
    logger.info("Running database migrations...")
    await init()
    logger.info("Migrations completed successfully!")

if __name__ == "__main__":
    asyncio.run(run_migrations())