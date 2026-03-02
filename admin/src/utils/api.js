// import axios from "axios";

// const token=localStorage.getItem("token");

// const params={
//     headers: {
//         'Authorization': `Bearer ${token}`, // Include your API key in the Authorization header
//         'Content-Type': 'application/json', // Adjust the content type as needed
//       },

// } 

// export const fetchDataFromApi = async (url) => {
//     try {
//         const { data } = await axios.get(process.env.REACT_APP_BASE_URL + url,params)
//         return data;
//     } catch (error) {
//         console.log(error);
//         return error;
//     }
// }


// export const uploadImage = async (url, formData) => {
//     const { res } = await axios.post(process.env.REACT_APP_BASE_URL + url , formData)
//     return res;
// }

// export const postData = async (url, formData) => {

//     try {
//         const response = await fetch(process.env.REACT_APP_BASE_URL + url, {
//             method: 'POST',
//             headers: {
//                 'Authorization': `Bearer ${token}`, // Include your API key in the Authorization header
//                 'Content-Type': 'application/json', // Adjust the content type as needed
//               },
           
//             body: JSON.stringify(formData)
//         });


      

//         if (response.ok) {
//             const data = await response.json();
//             //console.log(data)
//             return data;
//         } else {
//             const errorData = await response.json();
//             return errorData;
//         }

//     } catch (error) {
//         console.error('Error:', error);
//     }


// }


// export const editData = async (url, updatedData ) => {
//     const { res } = await axios.put(`${process.env.REACT_APP_BASE_URL}${url}`,updatedData)
//     return res;
// }

// export const deleteData = async (url ) => {
//     const { res } = await axios.delete(`${process.env.REACT_APP_BASE_URL}${url}`,params)
//     return res;
// }


// export const deleteImages = async (url,image ) => {
//     const { res } = await axios.delete(`${process.env.REACT_APP_BASE_URL}${url}`,image);
//     return res;
// }

import axios from "axios";

const token = localStorage.getItem("token");

const authConfig = {
  headers: {
    Authorization: `Bearer ${token}`,
  },
};

export const fetchDataFromApi = async (url) => {
  const { data } = await axios.get(
    process.env.REACT_APP_BASE_URL + url,
    authConfig
  );
  return data;
};

// ✅ UPLOAD IMAGE – FIX DỨT ĐIỂM NETWORK ERROR
export const uploadImage = async (url, formData) => {
  const { data } = await axios.post(
    process.env.REACT_APP_BASE_URL + url,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data;
};

export const postData = async (url, body) => {
  const { data } = await axios.post(
    process.env.REACT_APP_BASE_URL + url,
    body,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return data;
};

export const editData = async (url, body) => {
  const { data } = await axios.put(
    process.env.REACT_APP_BASE_URL + url,
    body,
    authConfig
  );
  return data;
};

export const deleteData = async (url) => {
  const { data } = await axios.delete(
    process.env.REACT_APP_BASE_URL + url,
    authConfig
  );
  return data;
};

export const deleteImages = async (url) => {
  const { data } = await axios.delete(
    process.env.REACT_APP_BASE_URL + url,
    authConfig
  );
  return data;
};
