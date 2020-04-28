from oct2py import octave


class MatLab:

    def __init__(self, formulae_path: str = None):
        self.formulae_path = formulae_path

    def get_formulae_path(self, formulae_path: str = None):
        if not formulae_path:
            if not self.formulae_path:
                raise Exception('Missing formulae path exception')
            else:
                return self.formulae_path
        else:
            return formulae_path

    def switch_formulae_path(self, formulae_path):
        formulae = self.get_formulae_path(formulae_path)
        octave.cd(formulae)

    def compute_plane_data(self, r: float, formulae_path: str = None):
        self.switch_formulae_path(formulae_path)
        plane_tilt, rear_flap_tilt = octave.plane(r, nout=2)
        result = {
            'plane_tilt': plane_tilt.ravel().tolist(),
            'rear_flap_tilt': rear_flap_tilt.ravel().tolist()
        }

        return result

    def compute_ball_data(self, r: float, formulae_path: str = None):
        self.switch_formulae_path(formulae_path)
        ball_pos, rod_pos = octave.ball(r, nout=2)
        result = {
            'ball_pos': ball_pos.ravel().tolist(),
            'rod_pos': rod_pos.ravel().tolist()
        }

        return result

    def compute_suspension_data(self, r: float, formulae_path: str = None):
        self.switch_formulae_path(formulae_path)
        car_pos, wheel_pos = octave.suspension(r, nout=2)
        result = {
            'car_pos': car_pos.ravel().tolist(),
            'wheel_pos': wheel_pos.ravel().tolist()
        }

        return result

    def compute_pendulum_data(self, r: float, formulae_path: str = None):
        self.switch_formulae_path(formulae_path)
        pos, tilt = octave.pendulum(r, nout=2)
        result = {
            'pos': pos.ravel().tolist(),
            'tilt': tilt.ravel().tolist()
        }

        return result

    @staticmethod
    def use_cli(commands: str):
        return octave.eval(commands)
