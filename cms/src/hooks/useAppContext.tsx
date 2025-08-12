import React, { createContext, ReactNode, useCallback, useContext, useMemo, useRef, useState } from 'react'
import { Blog } from 'types/src/Blog'
import { Post } from 'types/src/Post'

type AppState = {
    blog?: Blog,
    posts: Post[]
}

export type AppContext = AppState & {

}


const appContext = createContext<AppContext>({
    blog: undefined,
    posts:[] 
})

type Action = {
    before: AppState;
    after: AppState;
    timer: NodeJS.Timeout;
}

export function AppContextProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<AppState>({
        blog: undefined,
        posts: []
    })

    const actions =  useRef<Action[]>([]);

    const act =  useCallback((after: AppState, fn: (p: any) => Promise<void>, delay = 0) => {
        
        const action: Action = {
            before: state,
            after,
        }
    }, [state])

    const value = useMemo(() => ({
        ...state,

    }), [])

    return (
        <appContext.Provider value={value}>
            { children }
        </appContext.Provider>
    )
}

export function useAppContext() {
    const value = useContext(appContext)
    return value;
}