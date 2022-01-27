
import matplotlib.pyplot as plt
import numpy as np

L = np.array([0,0,0])
P = np.array([-5,1,1])
v = np.array([1,0.5,0.1])

power = 1
T = 0.6
diffusion = 1

def d(t):
    M = P + t * v
    return np.sqrt(np.dot(M,M))

def dd(t):
    return (v[0]*(P[0]+t*v[0]-L[0]) + v[1]*(P[1]+t*v[1]-L[1]) + v[2]*(P[2]+t*v[2]-L[2]))/d(t)

def I(t):
    return diffusion * (1 - T) * (power * T**(d(t)))/(d(t)**2)

def dI(x):
    # dx = 0.01
    # return (I(x+dx)-I(x))/dx
    return diffusion * (1 - T) * power * (np.log(T) * (1+dd(x))*T**(x+d(x))) / (d(x)**2) - (2 * T**(x+d(x)) * dd(x))/(d(x)**3)

def light(t):
    res = 0

    dx = 0.1
    x = 0
    while x < t:
        x += dx
        res += (T**x * I(x) + T**(x+dx) * I(x+dx)) * dx/2
    return res

X = [k/10 for k in range(1000)]
Y = [light(k/10) for k in range(1000)]
Y2 = [I(k/10) for k in range(1000)]

plt.plot(X,Y)
plt.plot(X,Y2)
plt.show()

