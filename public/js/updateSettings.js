import axios from 'axios';
import { showAlert } from './alert';

// type - data or password
export const updateSettings = async (data, type) => {
  try {
    const url = type === 'password' ? '/api/v1/users/change-password' : '/api/v1/users/updateme';
    const res = await axios({
      method: 'PATCH',
      url: `http://127.0.0.1:5000${url}`,
      data
    });

    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} updated successfully!`);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
