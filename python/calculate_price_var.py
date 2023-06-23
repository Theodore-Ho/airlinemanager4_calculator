import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression


def find_price():

    data = pd.read_csv('route.csv')  # All routes

    # Extract the required columns as features and target variables
    x = data['distance'].values.reshape(-1, 1)
    y_e = data['price_e'].values
    y_b = data['price_b'].values
    y_f = data['price_f'].values
    y_arr = [y_e, y_b, y_f]

    # Define breakpoints and number of segments
    breakpoints = [0, 3000, 6000, 9000, 12000, 15000, 18000, np.inf]  # All breakpoints
    n_segments = len(breakpoints) - 1

    # Initialize model coefficients and intercepts
    coefficients = np.zeros(n_segments)
    intercepts = np.zeros(n_segments)

    for y in y_arr:
        # Fit the segmented linear regression model
        for i in range(n_segments):
            segment_mask = (x >= breakpoints[i]) & (x < breakpoints[i + 1])
            x_segment = np.reshape(x[segment_mask], (-1, 1))
            y_segment = np.extract(segment_mask, y)
            model = LinearRegression()
            model.fit(x_segment, y_segment)
            coefficients[i] = model.coef_
            intercepts[i] = model.intercept_

        # Print the model coefficients and intercepts
        for i in range(n_segments):
            print(f'{str(breakpoints[i]) + "~" + str(breakpoints[i + 1])}: Coefficient={coefficients[i]}, Intercept={intercepts[i]}')


if __name__ == '__main__':
    find_price()
