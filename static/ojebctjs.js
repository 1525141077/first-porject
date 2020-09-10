//判断两个对象是否相等
let isEqual = (objA,objB) => {
    let isNo = false
    for (const k in objA) {
        // 判断数组
        if (k === 'projectFlieList' || k === 'competeFileList') {
            if (objA[k].length !== objB[k].length) {
                isNo = true
            } else {
                // 数组是否有值
                if (objA[k].length > 0) {
                    objA[k].forEach(n => {
                        if (n.fileId !== objB[k][0].fileId) {
                            isNo = true
                        }
                    })
                }
            }
        } else {
            // 判断日期
            if (k === 'closingDate' || k === 'feedbackDate') {
                objB[k] = objB[k].substring(0, 16)
                if (objA[k] !== objB[k]) {
                    isNo = true
                }
            } else {
                if (objA[k] !== objB[k]) {
                    isNo = true
                }
            }
        }
    }
    return isNo
}
export { isEqual }