import { AppError } from "utils/errorUtils";

function conflict(message: string): AppError {
    return {
        type: "conflict",
        message,
    }
}

export default {
    conflict
}