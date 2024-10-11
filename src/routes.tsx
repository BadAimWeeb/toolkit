import { Route, Routes } from "react-router-dom";

import { Home } from "./page/Home";

export function RoutesDefinition() {
    return <Routes>
        <Route path="/">
            <Route index element={<Home />} />
        </Route>
    </Routes>
}