import { Route, Routes } from "react-router-dom";

import { Home } from "./page/Home";
import { HashPass } from "./page/HashPass/Page";

export function RoutesDefinition() {
    return <Routes>
        <Route index element={<Home />} />
        <Route path="hashpass" element={<HashPass />} />
    </Routes>
}