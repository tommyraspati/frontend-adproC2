"use client";

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import ListingList, { Listing } from '@/components/sell/ListingList';
import { GetServerSideProps } from 'next';
import { useVerifyMutation } from '@/redux/features/authApiSlice';
import CheckoutButtons from '@/components/buy/CheckoutButtons';
import CartListingList, { CartListing } from '@/components/buy/CartListingList';


export default function Page() {
    const [cartListings, setCartListings] = useState<CartListing[]>();
    const [userId, setUserId] = useState<number>();
    const [balance, setBalance] = useState<number>();
    const [verify] = useVerifyMutation();

    const fetchAllListingsSeller = async (id: number) => {
        const response = await fetch(`http://34.142.129.98/cartlisting/user/${id}`);
        const data = await response.json();
        setCartListings(data); // Rename to setCartListings for clarity
    };

    useEffect(() => {
        verify(undefined)
            .unwrap()
            .then((response) => {
                setUserId(response.id);
                setBalance(response.balance);
                fetchAllListingsSeller(response.id);
            });
    }, [verify]); // Verify mutation should be stable, so it can be included here

    // Effect to log cartListings when it updates
    useEffect(() => {
        console.log("Cart Listings Updated:", cartListings);
        console.log(userId);
        console.log(balance);
    }, [cartListings]);

    return (
        <div>
            {cartListings && userId && balance && (
                <CheckoutButtons cartListings={cartListings} userId={userId} balance={balance} />
            )}
        </div>
    );
}