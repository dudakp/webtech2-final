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
        # pocet volani celkovo, pocet uspesnych, pocet neuspesnych
        df = pd.DataFrame(list(self.db.find({})))
        hist = df.groupby('command').command.count().to_dict()
        results = df.groupby('result').result.count().to_dict()
        total_calls = df['_id'].count()
        import pprint
        pp = pprint.PrettyPrinter(indent=4)
        pp.pprint(hist)
        pp.pprint(total_calls)
        return hist, results, total_calls
