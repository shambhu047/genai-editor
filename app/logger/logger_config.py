import json
import os
import logging
from logging import LogRecord
from contextvars import ContextVar

from abc import ABC


class TrackingId(ABC):
    __TRACKING_ID: ContextVar[str] = ContextVar('__TRACKING_ID', default=None)

    @staticmethod
    def set(tracking_id: str):
        TrackingId.__TRACKING_ID.set(tracking_id)

    @staticmethod
    def get():
        return TrackingId.__TRACKING_ID.get()


LOG_LEVEL = os.getenv('LOG_LEVEL', 'DEBUG')


class JsonFormatter(logging.Formatter):
    def __init__(self):
        super(JsonFormatter, self).__init__()

    @staticmethod
    def _serialize(obj):
        return json.dumps(obj, default=str)

    def format(self, record: LogRecord) -> str:
        record.message = record.getMessage()
        log = {
            'level': record.levelname,
            'time': self.formatTime(record),
            'message': self.formatMessage(record),
            'trackingId': TrackingId.get()
        }

        if record.exc_info:
            log['exception'] = self.formatException(record.exc_info)
        if record.stack_info:
            log['stackTrace'] = self.formatStack(record.stack_info)

        return self._serialize(log)


if logging.getLogger().hasHandlers():
    logging.getLogger().setLevel(LOG_LEVEL)
else:
    logging.basicConfig(level=LOG_LEVEL)

LOG = logging.getLogger()

for handler in LOG.handlers:
    handler.setFormatter(JsonFormatter())
