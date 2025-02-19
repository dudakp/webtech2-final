function [ball_pos, rod_pos] = ball(r, init1, init2)
    pkg load control

    m = 0.111;
    R = 0.015;
    g = -9.8;
    J = 9.99e-6;
    H = -m*g/(J/(R^2)+m);
    A = [0 1 0 0; 0 0 H 0; 0 0 0 1; 0 0 0 0];
    B = [0;0;0;1];
    C = [1 0 0 0];
    D = [0];
    K = place(A,B,[-2+2i,-2-2i,-20,-80]);
    N = -inv(C*inv(A-B*K)*B);

    sys = ss(A-B*K,B,C,D);

    t = 0:0.01:5;
    initRychlost=0;
    initZrychlenie=0;
    [y,t,x] = lsim(N*sys,r*ones(size(t)),t,[initRychlost;0;initZrychlenie;0]);

    ball_pos = N*x(:,1)
    rod_pos = x(:,3)
end