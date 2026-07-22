function StatCard({

    title,

    value,

    icon,

}) {

    return (

        <div className="bg-white rounded-3xl shadow-md border border-slate-200 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">

            <div className="flex justify-between items-start">

                <div>

                    <div className="w-14 h-14 rounded-2xl bg-indigo-100 flex items-center justify-center text-3xl">

                        {icon}

                    </div>

                </div>

                <div className="text-right">

                    <h2 className="text-4xl font-bold text-slate-800">

                        {value}

                    </h2>

                </div>

            </div>

            <div className="mt-6">

                <p className="text-lg font-semibold text-slate-700">

                    {title}

                </p>

                <p className="text-sm text-slate-500 mt-1">

                    Keep learning and improve every day.

                </p>

            </div>

        </div>

    );

}

export default StatCard;