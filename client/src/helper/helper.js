import axios from 'axios';

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN


/**Make API Requests */



/**Authenticate function */
export async function authentication(username){
    try {
        return await axios.post('/api/authenticate',{username})
    } catch (error) {
        return {error :"Username does not exist...!"}
    }
}

/**get User details */
export async function getUser({username}){
    try {
        const {data} = await axios.get(`/api/user/${username}`);
        return {data};
    } catch (error) {
        return {error: "password doesnt match...!"}
    }
}

/**Register user function */
export async function registerUser(credentials){
    try {
        const {data : {msg} , status} = await axios.post(`/ap/register`,credentials);
        let {username , email} = credentials;
        /**Send email */
        if(status === 201){
            await axios.post('/api/registerMail' , {username, userEmail : email, text : msg})
        }
        return Promise.resolve(msg)
    } catch (error) {
        return Promise.reject({error})
    }
}

/**Login  function  */
export async function verifyPassword({username , password}){
    try {
        if(username){
        const {data} =  await axios.post('/api/login', {username, password})
        return Promise.resolve({data});
        }
    } catch (error) {
        return Promise.reject({error : "Password doesnt match..!"})
    }
}

/**Update user function */
export async function updateUser(response){
    try {
        const token = await localStorage.getItem('token');
        const data = await axios.put('/api/updateUser', response, {headers : {"Authorization" : `Bearer ${token}`}})
        return Promise.resolve({data})
    } catch (error) {
        return Promise.reject({error: "Couldn't Update Profile...!"})
    }
}

/**Generate OTP */
export async function generateOTP(username){
    try {
       const {data : {code},status} = await axios.get('/api/generateOTP', { params : {username}})

       //send mail with OTP
       if(status === 201){
            let { data : { email }} = await getUser({username})
            let text = `Your password recover OTP is ${code}. Verify and recover password.`;
            await axios.post('/api/registerMail', {username, userEmail : email, text, subject : "password recovery OTP"})
       }
       return Promise.resolve(code);
    } catch (error) {
        return Promise.reject({error});
    }
}

/**Verify OTP */
export async function verifyOTP({ username, code }){
    try {
        const {data, status} = await axios.get('/api/verifyOTP', { params : {username, code }})
        return {data, status }
    } catch (error) {
        return Promise.reject(error);
    }
}

/**Reset password  */
export async function resetPassword({ username, password }){
    try {
        const { data, status } = await axios.put('/api/resetPassword',{username, password });
        return Promise.resolve({ data, status })
    } catch (error) {
        return Promise.reject({error})
    }
}
