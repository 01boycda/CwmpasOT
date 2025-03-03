/*
import { createContext, useContext, useEffect, useState } from "react";
import { Platform } from "react-native";
import Purchases, { LOG_LEVEL, PurchasesPackage, CustomerInfo } from "react-native-purchases";

const RC_APIKeys = {
    ios: "appl_fWbnuHjuMRvfKmvGcvxVSOKlPCK",
    // ADD ANDROID
}

interface RevenueCatProps {
    purchasePackage?: (pack: PurchasesPackage) => Promise<void>;
    restorePermissions?: () => Promise<CustomerInfo>;
    user: UserState;
    packages: PurchasesPackage[];
}

export interface UserState {
    subscribed: boolean;
}

const RevenueCatContext = createContext<RevenueCatProps | null>(null);

// Export context for easy usage
export const useRevenueCat = () => {
    return useContext(RevenueCatContext) as RevenueCatProps;
}

// Provide RevenueCat functions to our app
export const RevenueCatProvider = ({ children }: any) => {
    const [user, setUser] = useState<UserState>({ subscribed: false });
    const [packages, setPackages] = useState<PurchasesPackage[]>([]);
    const [isReady, setIsReady] = useState<boolean>(false);

    useEffect(() => {
        const init = async () => {
            if (Platform.OS === "ios") {
                await Purchases.configure({ apiKey: RC_APIKeys.ios });
            }
            // ADD ANDROID

            setIsReady(true);

            Purchases.setLogLevel(LOG_LEVEL.DEBUG);

            Purchases.addCustomerInfoUpdateListener((customerInfo) => {
                console.log("Customer Info:", customerInfo);

                updateCustomerInformation(customerInfo);
            })

            await loadOfferings();
        };

        init();
    }, []);

    // Load all offerings a user can (currently) purchase
    const loadOfferings = async () => {
        const offerings = await Purchases.getOfferings();

        const currentOffering = offerings.current;
        if (currentOffering) {
            setPackages(currentOffering.availablePackages);
        }
    }

    // A purchase package
    const purchasePackage = async (pack: PurchasesPackage) => {
        try {
            await Purchases.purchasePackage(pack);

            if (pack.product.identifier === "cwmpasot_full_access_monthly") {

            }
        } catch (e) {
            console.log("Purchase Failed:", e);
            alert(e);
        }
    };

    // Update user state based on previous purchases
    const updateCustomerInformation = async (customerInfo: CustomerInfo) => {
        const newUser: UserState = { subscribed: false };

        if (customerInfo?.entitlements.active["full_access"] !== undefined) {
            newUser.subscribed = true;
        };

        setUser(newUser);
    };

    // Restore previous purchases
    const restorePermissions = async () => {
        const customer = await Purchases.restorePurchases();
        return customer;
    }

    const value = {
        restorePermissions,
        user,
        packages,
        purchasePackage,
    };

    // Return empty fragment if provider is not ready (Purchase not yet initialised)
    if (!isReady) return <></>

    return <RevenueCatContext.Provider value={value}>{children}</RevenueCatContext.Provider>
}
    */