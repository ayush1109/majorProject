import React from "react";
import Cancelled from "./Cancelled";
import Orders from "./Orders";
import CenteredTabs from "./tabs/CenteredTab";

export default function MyOrders(props) {
    const [activeTab, setActiveTab] = React.useState(0);

    const headings = [
        "My Orders",
        "Cancelled Orders"
    ];

    const renderForm = () => {
        if (activeTab === 0) return <Orders />;
        if (activeTab === 1) return <Cancelled />;
    };

    return (
        <>
            <CenteredTabs
                headings={headings}
                changeActiveTab={setActiveTab}
                centered
            />
            <br />
            <br />
            {renderForm()}
        </>
    );
}
