import axios from "axios";

const getAuthConfig = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };
};

const getErrorPayload = (error) => {
  if (error?.response?.data) {
    return error.response.data;
  }

  return {
    error: true,
    msg: error?.message || "Request failed",
  };
};

export const fetchDataFromApi = async (url) => {
  try {
    const { data } = await axios.get(
      process.env.REACT_APP_BASE_URL + url,
      getAuthConfig()
    );

    return data;
  } catch (error) {
    console.log("fetchDataFromApi error:", error);
    return getErrorPayload(error);
  }
};

export const uploadImage = async (url, formData) => {
  try {
    const token = localStorage.getItem("token");

    const { data } = await axios.post(
      process.env.REACT_APP_BASE_URL + url,
      formData,
      {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return data;
  } catch (error) {
    console.log("uploadImage error:", error);
    return getErrorPayload(error);
  }
};

export const postData = async (url, body) => {
  try {
    const token = localStorage.getItem("token");

    const { data } = await axios.post(process.env.REACT_APP_BASE_URL + url, body, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        "Content-Type": "application/json",
      },
    });

    return data;
  } catch (error) {
    console.log("postData error:", error);
    return getErrorPayload(error);
  }
};

export const editData = async (url, body) => {
  try {
    const { data } = await axios.put(
      process.env.REACT_APP_BASE_URL + url,
      body,
      getAuthConfig()
    );

    return data;
  } catch (error) {
    console.log("editData error:", error);
    return getErrorPayload(error);
  }
};

export const deleteData = async (url) => {
  try {
    const { data } = await axios.delete(
      process.env.REACT_APP_BASE_URL + url,
      getAuthConfig()
    );

    return data;
  } catch (error) {
    console.log("deleteData error:", error);
    return getErrorPayload(error);
  }
};

export const deleteImages = async (url) => {
  try {
    const { data } = await axios.delete(
      process.env.REACT_APP_BASE_URL + url,
      getAuthConfig()
    );

    return data;
  } catch (error) {
    console.log("deleteImages error:", error);
    return getErrorPayload(error);
  }
};
