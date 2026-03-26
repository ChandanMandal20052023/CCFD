from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status

class PredictAPIViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_predict_endpoint_no_data(self):
        # The endpoint expects data. Sending none should return 400.
        res = self.client.post('/api/predict/')
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_predict_endpoint_valid_data(self):
        # Credit Card fraud dataset has V1..V28 and Amount. That's 29 features.
        # Create a dummy row of 29 zeros for prediction.
        dummy_data = {f'V{i}': 0 for i in range(1, 29)}
        dummy_data['Amount'] = 0.0
        
        # Test with one valid dictionary
        res = self.client.post('/api/predict/', data=dummy_data, format='json')
        print("Response:", res.data)
        
        self.assertIn(res.status_code, [status.HTTP_200_OK, status.HTTP_503_SERVICE_UNAVAILABLE])
        if res.status_code == status.HTTP_200_OK:
            self.assertIn('predictions', res.data)
            self.assertIn('probabilities', res.data)
