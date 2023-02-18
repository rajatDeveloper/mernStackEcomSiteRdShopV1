class ApiFeatures {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }

    search() {
        const keyword = this.queryStr.keyword ? {
            name: {
                $regex: this.queryStr.keyword,
                $options: "i",
            }
        } : {};
        // console.log(keyword);
        this.query = this.query.find({ ...keyword });
        return this;
    }


    filter() {
        //in js object is passed by refernce so to get really copy of object we use ... opertaor 
        const queryCopy = { ...this.queryStr };
        // console.log(queryCopy);
        // rmoving the some fields of category  
        const removeFields = ["keyword", "page", "limit"];
        removeFields.forEach(key => delete queryCopy[key]);
        // console.log(queryCopy);
        // Filter For Price and Rating

        let queryStr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);

        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }

    pagination(resultPerPage) {

        const currntPage = Number(this.queryStr.page) || 1;
        const skip = resultPerPage * (currntPage - 1);

        this.query = this.query.limit(resultPerPage).skip(skip);
        return this;
    }

};

module.exports = ApiFeatures; 