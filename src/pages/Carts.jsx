import React from 'react';

function Carts() {
    return <div className='cart-container p-4 lg:p-8 min-h-screen bg-slate-100 text-slate-900 '>

        <div className="cart-main space-y-6" >
            <div className="cart-header rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-xl">
                <p className='text-sm tracking-[0.35em] text-cyan-400'>CARTS</p>
                <h2 className='mt-2 text-2xl font-semibold text-slate-900'>Cart overview</h2>
                <p className='mt-2 text-sm text-slate-500 '>All active carts returned from the API are rendered here with their latest item details.</p>

            </div> {/* //header */}
            <div className="cart-empty grid gap-6 xl:grid-cols-2">
                <div className='rounded-3xl border border-dashed border-slate-300 p-6 text-sm text-slate-500'>No carts returned from the API.</div>

            </div> {/* //empty */}
        </div> {/* //main */}

       

       






        
    </div>;
}

export default Carts;