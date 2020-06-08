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

    def all_to_html(self, dataframe=None):
        root = str(Path(__file__).parent.absolute())
        if dataframe is None:
            df = pd.DataFrame(list(self.db.find({})))
            del df['_id']
            df.to_html(root + '/../static/export.html', index=False, header=True)
            print('exporting invoked in route')
        print('exporting invoked by client')
        dataframe.to_html(root + '/../static/stats.html', index=False, header=True)

    def all_to_pdf(self, dataframe=None):
        root = str(Path(__file__).parent.absolute())
        if dataframe is None:
            self.all_to_html()
            pdfkit.from_file(root + '/../static/export.html', root + '/../static/export.pdf')
        self.all_to_html(dataframe)
        pdfkit.from_file(root + '/../static/stats.html', root + '/../static/stats.pdf')

    def compute_stats(self):
        # pocet volani celkovo, pocet uspesnych, pocet neuspesnych
        df = pd.DataFrame(list(self.db.find({})))
        hist = df.groupby('command').command.count()
        results = df.groupby('result').result.count()
        total_calls = df['_id'].count()
        df_complete_stats = pd.concat(
            [hist, results, pd.DataFrame.from_dict({'TOTAL_CALLS': total_calls}, orient='index')]).reset_index()
        self.all_to_pdf(df_complete_stats)
        return hist.to_dict(), results.to_dict(), total_calls
