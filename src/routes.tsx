import { Route, Routes } from "react-router-dom";

import { Home } from "./page/Home";
import { HashPass } from "./page/HashPass/Page";
import { TwoFAGen } from "./page/2FAGen/Page";

export function RoutesDefinition() {
    return <Routes>
        <Route index element={<Home />} />
        <Route path="hashpass" element={<HashPass />} />
        <Route path="2fagen" element={<TwoFAGen />} />
    </Routes>
}