export default function rateLimit(props) {
    const { time: windowMs = 60000, max = 100, message = "Rate limit exceeded. Please try again later." } = props;
    const requests = new Map();
    return (ctx) => {
        const currentTime = new Date();
        const socketIP = ctx.getIP().address;
        if (!requests.has(socketIP)) {
            requests.set(socketIP, { count: 0, startTime: currentTime });
        }
        const requestInfo = requests.get(socketIP);
        if (requestInfo) {
            if (currentTime - requestInfo.startTime > windowMs) {
                requestInfo.count = 1;
                requestInfo.startTime = currentTime;
            }
            else {
                requestInfo.count++;
            }
        }
        if (requestInfo && requestInfo.count > max) {
            return ctx.status(429).json({
                error: message
            });
        }
    };
}
export const binaryS = (arr, target, start, end) => {
    if (start > end) {
        return false;
    }
    let mid = start + (end - start) / 2;
    // console.log(mid)
    if (arr[mid] == target) {
        return true;
    }
    if (arr[mid] > target) {
        return binaryS(arr, target, start, mid - 1);
    }
    return binaryS(arr, target, mid + 1, end);
};
// public int Bsearch(int[] arr,int target,int start,int end){
//     if (start > end){
//         return -1;
//     }
//     int mid = start + (end-start)/2;
//     if (arr[mid] == target){
//         return mid;
//     }
//     if (arr[mid] > target){
//     return Bsearch(arr,target,start,mid-1);
//     }
//     return Bsearch(arr,target,mid+1,end);
// }
