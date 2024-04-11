/**
 * AsyncInterface.js
 *  - This file contains the AsyncInterface class
 *  - This class is used to call callback architecture functions asynchronously
 * 
 *  - Usage:
 *      - Import the AsyncInterface class
 *      - Use the Execute method to call the callback architecture function asynchronously
 *      - The Execute method will return a promise
 *      - The promise will resolve with the result of the callback architecture function
 * 
 *  - The callback architecture function should have the following signature:
 *      - The callback architecture function should accept two callback functions as the last two arguments
 *      
 *      example:
 *          function myCallbackFunction(arg1, arg2, callback, errorCallback)
 * 
 *          - arg1, arg2 are the arguments passed to the callback architecture function
 *          
 *          AAI.Execute(myCallbackFunction, null, arg1, arg2)
 *          
 *          - The context parameter is optional, if you want to bind the callback architecture function to a context (for object methods)
 */
export default class AAI {
    constructor(callBack_architecture_func, context = null) {
        this.callBack_architecture_func = callBack_architecture_func;

        // If the context is provided, bind the callback architecture function to the context
        if (context) {
            this.callBack_architecture_func = this.callBack_architecture_func.bind(context);
        }

    }

    async Call(...args) {
        return new Promise((resolve, reject) => {

            this.callBack_architecture_func(...args, (...result) => {

                resolve(result);
            }, (...error) => {

                const function_name = this.callBack_architecture_func.name;

                console.error("Error : ", function_name, error);
                reject(error);
            });
        });
    }

    static async Execute(callBack_architecture_func, context = null, ...args) {
        try {
            // Creating an instance of AAI
            const instance = new AAI(callBack_architecture_func, context);

            // Calling the Call method of the instance
            const result = await instance.Call(...args);

            // Returning the result directly
            return result;
        } catch (error) {
            console.error("Error executing callback architecture function:", error);
            throw error; // or handle the error accordingly
        }
    }
}