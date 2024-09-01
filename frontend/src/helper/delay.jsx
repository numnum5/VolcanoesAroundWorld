
// A function for delaying an ayscnronous code for a give mili seconds
export default function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}