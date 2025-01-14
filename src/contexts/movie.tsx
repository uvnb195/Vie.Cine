import { MovieRunTime, MovieType } from "@/constants/types/MovieType";
import { createContext, ReactNode, useContext, useState } from "react";

export interface AdminMovieType {
    _id: string,
    movieId: number,
    movieName: string,
    movieImageUri: string,
    startTime: Date,
    endAt: Date
}

interface AdminMovie {
    data: AdminMovieType | null,
    handleData: (data: AdminMovieType | null) => void
}

const AdminMovieContext = createContext<AdminMovie | null>(null)

export const useAdminMovie = () => {
    const context = useContext(AdminMovieContext)
    if (!context) {
        throw new Error('useAdminMovie must be used within a AdminMovieProvider')
    }
    return context
}

const AdminMovieProvider = ({ children }: { children: ReactNode }) => {
    const [data, setData] = useState<AdminMovieType | null>(null)

    return (
        <AdminMovieContext.Provider value={{
            data: data,
            handleData: setData
        }}>
            {children}
        </AdminMovieContext.Provider>
    )
}

export default AdminMovieProvider