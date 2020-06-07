import pdfkit
from pathlib import Path
import pandas as pd

from flask_app.util.logger import Singleton


class DBExporter(metaclass=Singleton):

    def __init__(self, db, collection_name):
        self.db = db[collection_name]

    def all_to_csv(self):
        df = pd.DataFrame(list(self.db.find({})))
        del df['_id']
        df.to_csv(str(Path(__file__).parent.absolute()) + '/../static/export.csv', index=False, header=True)

    def all_to_html(self):
        df = pd.DataFrame(list(self.db.find({})))
        del df['_id']
        root = str(Path(__file__).parent.absolute())
        df.to_html(root + '/../static/export.html', index=False, header=True)

    def all_to_pdf(self):
        root = str(Path(__file__).parent.absolute())
        self.all_to_html()
        pdfkit.from_file(root + '/../static/export.html', root + '/../static/export.pdf')

    def compute_stats(self):
        df = pd.DataFrame(list(self.db.find({})))
        del df['_id']
        del df['timestamp']
        del df['result']
        del df['info']
        return df.groupby('command').command.count().to_dict()
