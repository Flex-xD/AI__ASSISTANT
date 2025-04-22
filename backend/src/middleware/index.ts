export const authMiddleWare = async () => {
    try {

    } catch (error) {

    }
}

export const handleApiError = (
    message: string,
    statusCode: number , 
    errorDetails:string ) => {
    return {
        success: false,
        message,
        statusCode , 
        errorDetails
    }
}