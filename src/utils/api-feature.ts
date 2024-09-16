import { paginationFunction } from "./pagination"

export class APIFeatures {
    query: any
    mongooseQuery: any
    constructor(query: any, mongooseQuery: any) {
        this.query = query
        this.mongooseQuery = mongooseQuery
    }

    pagination({ page, size }: { page: number; size: number }) {
    //  Get all products paginated 
        const { limit, skip } = paginationFunction({ page, size })
        this.mongooseQuery = this.mongooseQuery.limit(limit).skip(skip)
        return this
    }

    sort(sortBy: any) {
        if (!sortBy) {
            this.mongooseQuery = this.mongooseQuery.sort({ createdAt: -1 })
            return this
        }
        const formula = sortBy.replace(/desc/g, -1).replace(/asc/g, 1).replace(/ /g, ':') 
        const [key, value] = formula.split(':')
        this.mongooseQuery = this.mongooseQuery.sort({ [key]: +value })
        return this
    }

    // Search on students with nationalId
    searchStudents(search: any) {
        const queryFiler: any = {}
        if (search.nationalId) queryFiler.nationalId = { $regex: search.nationalId }
        this.mongooseQuery = this.mongooseQuery.find(queryFiler)
        return this
    }

    // Search on teachers with nationalId
    searchTeachers(search: any) {
        const queryFiler: any = {}
        if (search.nationalId) queryFiler.nationalId = { $regex: search.nationalId, $options: 'i' }
        this.mongooseQuery = this.mongooseQuery.find(queryFiler)
        return this
    }

    // Search on teachers with name
    searchParent(search: any) {
        const queryFiler: any = {}
        if (search.name) queryFiler.name = { $regex: search.name, $options: 'i' }
        this.mongooseQuery = this.mongooseQuery.find(queryFiler)
        return this
    }

}
