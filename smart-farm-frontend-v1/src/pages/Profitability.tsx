import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Droplet, Zap, CreditCard, DollarSign, Percent, Clock, RefreshCw } from 'lucide-react';
import {
    profitabilityService,
    MonthlyFinancial,
    ResourceUsage,
    CropProfitability,
    WaterEfficiency
} from '../services/api';

const ProfitabilityDashboard: React.FC = () => {
    // État pour stocker les données du backend
    const [timeFrame, setTimeFrame] = useState<string>('monthly');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // États pour les différentes données
    const [mergedData, setMergedData] = useState<MonthlyFinancial[]>([]);
    //const [costData, setConstData] = useState<MonthlyFinancial[]>([]);
    //const [profitData, setProfitData] = useState<MonthlyFinancial[]>([]);
    const [resourceUsageData, setResourceUsageData] = useState<ResourceUsage[]>([]);
    const [cropProfitabilityData, setCropProfitabilityData] = useState<CropProfitability[]>([]);
    const [waterEfficiencyData, setWaterEfficiencyData] = useState<WaterEfficiency[]>([]);
    const [kpis, setKpis] = useState({
        totalRevenue: 0,
        totalCost: 0,
        totalProfit: 0,
        profitMargin: 0,
        revenueGrowth: 0,
        costGrowth: 0,
        profitGrowth: 0,
        marginGrowth: 0,
        waterUsage: 0,
        energyUsage: 0
    });

    // État pour suivre la date de dernière mise à jour
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

    // Fonction pour obtenir les dates en fonction du timeFrame
    const getDateRange = () => {
        const now = new Date();
        const endDate = now.toISOString().split('T')[0];
        const startDate = new Date();

        if (timeFrame === 'weekly') {
            startDate.setDate(now.getDate() - 7);
        } else if (timeFrame === 'monthly') {
            startDate.setMonth(now.getMonth() - 1);
        } else if (timeFrame === 'yearly') {
            startDate.setFullYear(now.getFullYear() - 1);
        }

        return {
            startDate: startDate.toISOString().split('T')[0],
            endDate
        };
    };

    // Fonction pour charger toutes les données
    const loadAllData = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const { startDate, endDate } = getDateRange();
            const currentYear = new Date().getFullYear();

            // Chargement des données financières mensuelles
            const financialData = await profitabilityService.getMonthlyFinancialData(currentYear);
            if (financialData && Array.isArray(financialData)) {
                setMergedData(
                    financialData.map(item => ({
                        name: item.name,          // nom du mois
                        revenus: item.revenue,    // clé pour le graphique de revenus
                        couts: item.cost,         // clé pour le graphique de coûts
                        profit: item.profit       // clé pour le graphique de profit
                    }))
                );

                //setProfitData(
                    //financialData.map(item => ({
                      //  name: item.name,
                    //    value: item.profit
                  //  }))
                //);
            }


            // Chargement des données d'utilisation des ressources
            const resourceData = await profitabilityService.getResourceUsageData(startDate, endDate);
            if (resourceData) {
                setResourceUsageData(resourceData);
            }

            // Chargement des données de rentabilité par culture
            const cropData = await profitabilityService.getCropProfitabilityData(startDate, endDate);
            if (cropData) {
                setCropProfitabilityData(cropData);
            }

            // Chargement des données d'efficacité d'eau
            const waterData = await profitabilityService.getWaterEfficiencyData();
            if (waterData) {
                setWaterEfficiencyData(waterData);
            }

            // Chargement des KPIs du tableau de bord
            const dashboardKpis = await profitabilityService.getDashboardKPIs(startDate, endDate);
            if (dashboardKpis) {
                setKpis({
                    totalRevenue: dashboardKpis.totalRevenue || 0,
                    totalCost: dashboardKpis.totalCost || 0,
                    totalProfit: dashboardKpis.totalProfit || 0,
                    profitMargin: dashboardKpis.profitMargin || 0,
                    revenueGrowth: dashboardKpis.revenueGrowth || 0,
                    costGrowth: dashboardKpis.costGrowth || 0,
                    profitGrowth: dashboardKpis.profitGrowth || 0,
                    marginGrowth: dashboardKpis.marginGrowth || 0,
                    waterUsage: dashboardKpis.waterUsage || 0,
                    energyUsage: dashboardKpis.energyUsage || 0
                });
            }

            // Mettre à jour la date de dernière mise à jour des données
            setLastUpdated(new Date());
        } catch (err) {
            console.error("Erreur lors du chargement des données", err);
            setError("Impossible de charger les données. Veuillez réessayer plus tard.");

            // Données de démonstration en cas d'erreur
            setRevenueData([
                { name: 'Jan', value: 4000 },
                { name: 'Fév', value: 3000 },
                { name: 'Mar', value: 5000 },
                { name: 'Avr', value: 7000 },
                { name: 'Mai', value: 6000 },
                { name: 'Jun', value: 8000 },
            ]);
            setConstData([
                { name: 'Jan', value: 3000 },
                { name: 'Fév', value: 2700 },
                { name: 'Mar', value: 4200 },
                { name: 'Avr', value: 5500 },
                { name: 'Mai', value: 5200 },
                { name: 'Jun', value: 6000 },
            ]);
            setProfitData([
                { name: 'Jan', value: 1000 },
                { name: 'Fév', value: 300 },
                { name: 'Mar', value: 800 },
                { name: 'Avr', value: 1500 },
                { name: 'Mai', value: 800 },
                { name: 'Jun', value: 2000 },
            ]);
            setResourceUsageData([
                { name: 'Eau', value: 2500, color: '#3b82f6' },
                { name: 'Électricité', value: 1800, color: '#eab308' },
                { name: 'Main d\'œuvre', value: 3000, color: '#ef4444' },
                { name: 'Engrais', value: 1200, color: '#22c55e' },
                { name: 'Autres', value: 800, color: '#a855f7' },
            ]);
            setCropProfitabilityData([
                { name: 'Tomates', revenue: 5200, cost: 3100, profit: 2100 },
                { name: 'Laitue', revenue: 3800, cost: 2200, profit: 1600 },
                { name: 'Concombres', revenue: 4500, cost: 2800, profit: 1700 },
                { name: 'Poivrons', revenue: 6200, cost: 4100, profit: 2100 },
            ]);
            setWaterEfficiencyData([
                { name: 'Zone A', efficiency: 0.85, usage: 1200 },
                { name: 'Zone B', efficiency: 0.72, usage: 1800 },
                { name: 'Zone C', efficiency: 0.91, usage: 950 },
                { name: 'Zone D', efficiency: 0.78, usage: 1500 },
            ]);
            setKpis({
                totalRevenue: 33000,
                totalCost: 26600,
                totalProfit: 6400,
                profitMargin: 19.4,
                revenueGrowth: 12,
                costGrowth: 8,
                profitGrowth: 15,
                marginGrowth: 2.5,
                waterUsage: 6450,
                energyUsage: 1800
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Fonction pour générer un rapport (quotidien ou mensuel)
    const generateReport = async (type: 'daily' | 'monthly') => {
        try {
            setIsLoading(true);
            const today = new Date();

            if (type === 'daily') {
                // Générer un rapport quotidien pour aujourd'hui
                const dateStr = today.toISOString().split('T')[0];
                await profitabilityService.generateDailyReport(dateStr);
            } else {
                // Générer un rapport mensuel pour le mois en cours
                const year = today.getFullYear();
                const month = today.getMonth() + 1; // getMonth() retourne 0-11
                await profitabilityService.generateMonthlyReport(year, month);
            }

            // Recharger les données après la génération du rapport
            await loadAllData();
        } catch (err) {
            console.error(`Erreur lors de la génération du rapport ${type}:`, err);
            setError(`Impossible de générer le rapport ${type === 'daily' ? 'quotidien' : 'mensuel'}. Veuillez réessayer plus tard.`);
        } finally {
            setIsLoading(false);
        }
    };

    // Charger les données au chargement initial et lors du changement de timeFrame
    useEffect(() => {
        loadAllData();
    }, [timeFrame]);

    // Format pour la date de dernière mise à jour
    const formatLastUpdated = () => {
        return `${lastUpdated.toLocaleDateString()} à ${lastUpdated.toLocaleTimeString()}`;
    };

    return (
        <div className="bg-gray-50 min-h-screen p-6">
            <header className="mb-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Tableau de Bord de Rentabilité</h1>
                        <p className="text-gray-600">Analyse de la performance économique de votre Smart Farm</p>
                    </div>
                    <div className="flex space-x-4">
                        <button
                            className="px-4 py-2 bg-green-500 text-white rounded-lg flex items-center shadow hover:bg-green-600 transition"
                            onClick={() => generateReport('daily')}
                            disabled={isLoading}
                        >
                            <Clock size={18} className="mr-2" />
                            Générer Rapport Quotidien
                        </button>
                        <button
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center shadow hover:bg-blue-600 transition"
                            onClick={() => generateReport('monthly')}
                            disabled={isLoading}
                        >
                            <Clock size={18} className="mr-2" />
                            Générer Rapport Mensuel
                        </button>
                    </div>
                </div>

                <div className="mt-4 flex justify-between items-center">
                    <div className="flex space-x-4">
                        <button
                            className={`px-4 py-2 rounded-lg ${timeFrame === 'weekly' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                            onClick={() => setTimeFrame('weekly')}
                        >
                            Hebdomadaire
                        </button>
                        <button
                            className={`px-4 py-2 rounded-lg ${timeFrame === 'monthly' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                            onClick={() => setTimeFrame('monthly')}
                        >
                            Mensuel
                        </button>
                        <button
                            className={`px-4 py-2 rounded-lg ${timeFrame === 'yearly' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                            onClick={() => setTimeFrame('yearly')}
                        >
                            Annuel
                        </button>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                        <span className="mr-2">Dernière mise à jour: {formatLastUpdated()}</span>
                        <button
                            onClick={loadAllData}
                            className="p-1 rounded-full hover:bg-gray-200 transition"
                            disabled={isLoading}
                        >
                            <RefreshCw size={16} className={`${isLoading ? 'animate-spin' : ''}`} />
                        </button>
                    </div>
                </div>
            </header>

            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            ) : error ? (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Erreur ! </strong>
                    <span className="block sm:inline">{error}</span>
                </div>
            ) : (
                <>
                    {/* Indicateurs KPI */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-xl shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Revenu Total</p>
                                    <p className="text-2xl font-bold">{kpis.totalRevenue.toLocaleString()} €</p>
                                </div>
                                <div className="bg-green-100 p-3 rounded-full">
                                    <DollarSign size={24} className="text-green-600" />
                                </div>
                            </div>
                            <div className="mt-4 flex items-center text-sm text-green-600">
                                <TrendingUp size={16} />
                                <span className="ml-1">+{kpis.revenueGrowth}% par rapport au mois dernier</span>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Coûts Opérationnels</p>
                                    <p className="text-2xl font-bold">{kpis.totalCost.toLocaleString()} €</p>
                                </div>
                                <div className="bg-red-100 p-3 rounded-full">
                                    <CreditCard size={24} className="text-red-600" />
                                </div>
                            </div>
                            <div className="mt-4 flex items-center text-sm text-red-600">
                                <TrendingUp size={16} />
                                <span className="ml-1">+{kpis.costGrowth}% par rapport au mois dernier</span>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Profit</p>
                                    <p className="text-2xl font-bold">{kpis.totalProfit.toLocaleString()} €</p>
                                </div>
                                <div className="bg-blue-100 p-3 rounded-full">
                                    <TrendingUp size={24} className="text-blue-600" />
                                </div>
                            </div>
                            <div className="mt-4 flex items-center text-sm text-green-600">
                                <TrendingUp size={16} />
                                <span className="ml-1">+{kpis.profitGrowth}% par rapport au mois dernier</span>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Marge Bénéficiaire</p>
                                    <p className="text-2xl font-bold">{kpis.profitMargin.toFixed(1)}%</p>
                                </div>
                                <div className="bg-purple-100 p-3 rounded-full">
                                    <Percent size={24} className="text-purple-600" />
                                </div>
                            </div>
                            <div className="mt-4 flex items-center text-sm text-green-600">
                                <TrendingUp size={16} />
                                <span className="ml-1">+{kpis.marginGrowth}% par rapport au mois dernier</span>
                            </div>
                        </div>
                    </div>

                    {/* Graphiques de revenus et coûts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-xl shadow">
                            <h2 className="text-xl font-bold mb-4">Revenus vs Coûts</h2>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={mergedData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone"  dataKey="revenus" name="Revenus" stroke="#22c55e" strokeWidth={2} />
                                    <Line type="monotone"  dataKey="couts" name="Coûts" stroke="#ef4444" strokeWidth={2} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow">
                            <h2 className="text-xl font-bold mb-4">Profit Mensuel</h2>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={mergedData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="profit" name="Profit" fill="#3b82f6" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Répartition des coûts et rentabilité par culture */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-xl shadow">
                            <h2 className="text-xl font-bold mb-4">Répartition des Coûts</h2>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={resourceUsageData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={100}
                                        fill="#8884d8"
                                        dataKey="value"
                                        nameKey="name"
                                        label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                    >
                                        {resourceUsageData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow">
                            <h2 className="text-xl font-bold mb-4">Rentabilité par Culture</h2>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={cropProfitabilityData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="revenue" name="Revenus" fill="#22c55e" />
                                    <Bar dataKey="cost" name="Coûts" fill="#ef4444" />
                                    <Bar dataKey="profit" name="Profit" fill="#3b82f6" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Utilisation des ressources */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-xl shadow">
                            <h2 className="text-xl font-bold mb-4">Efficacité de l'Eau par Zone</h2>
                            <div className="grid grid-cols-1 gap-4">
                                {waterEfficiencyData.map((zone) => (
                                    <div key={zone.name} className="border p-4 rounded-lg">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="font-medium">{zone.name}</span>
                                            <div className="flex items-center">
                                                <Droplet size={16} className="text-blue-500 mr-1" />
                                                <span>{zone.usage} L</span>
                                            </div>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                                            <div
                                                className="bg-blue-600 h-2.5 rounded-full"
                                                style={{ width: `${zone.efficiency * 100}%` }}
                                            ></div>
                                        </div>
                                        <div className="text-right mt-1 text-sm text-gray-500">
                                            Efficacité: {(zone.efficiency * 100).toFixed(1)}%
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow">
                            <h2 className="text-xl font-bold mb-4">Utilisation des Ressources</h2>
                            <div className="space-y-6">
                                <div>
                                    <div className="flex justify-between mb-2">
                                        <span className="font-medium">Consommation d'eau</span>
                                        <span>{kpis.waterUsage.toLocaleString()} L</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <div
                                            className="bg-blue-600 h-2.5 rounded-full"
                                            style={{ width: `${(kpis.waterUsage / 10000) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between mb-2">
                                        <span className="font-medium">Consommation d'énergie</span>
                                        <span>{kpis.energyUsage.toLocaleString()} kWh</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <div
                                            className="bg-yellow-500 h-2.5 rounded-full"
                                            style={{ width: `${(kpis.energyUsage / 3000) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mt-4">
                                    <div className="bg-blue-50 p-4 rounded-lg flex items-center">
                                        <Droplet size={24} className="text-blue-500 mr-3" />
                                        <div>
                                            <p className="text-sm text-gray-500">Eau économisée</p>
                                            <p className="font-bold">1,250 L</p>
                                        </div>
                                    </div>
                                    <div className="bg-yellow-50 p-4 rounded-lg flex items-center">
                                        <Zap size={24} className="text-yellow-500 mr-3" />
                                        <div>
                                            <p className="text-sm text-gray-500">Énergie économisée</p>
                                            <p className="font-bold">320 kWh</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ROI et analyse de rentabilité */}
                    <div className="bg-white p-6 rounded-xl shadow mb-8">
                        <h2 className="text-xl font-bold mb-4">Analyse de Rentabilité</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-500 mb-1">ROI du système IoT</p>
                                <p className="text-3xl font-bold text-blue-600">+42.3%</p>
                                <p className="text-xs text-gray-500 mt-1">Retour sur investissement sur 1 an</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-500 mb-1">Coût par hectare</p>
                                <p className="text-3xl font-bold text-red-600">1,280 €</p>
                                <p className="text-xs text-gray-500 mt-1">Moyenne sur la période</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-500 mb-1">Revenu par hectare</p>
                                <p className="text-3xl font-bold text-green-600">1,850 €</p>
                                <p className="text-xs text-gray-500 mt-1">Moyenne sur la période</p>
                            </div>
                        </div>

                        <div className="mt-6">
                            <h3 className="font-medium mb-2">Résumé de l'analyse</h3>
                            <p className="text-gray-600">
                                L'analyse de rentabilité montre une marge bénéficiaire de <span className="font-semibold">{kpis.profitMargin.toFixed(1)}%</span>,
                                avec une croissance du profit de <span className="font-semibold">{kpis.profitGrowth}%</span> par rapport à la période précédente.
                                Les investissements dans les technologies IoT ont permis de réduire les coûts opérationnels et d'optimiser l'utilisation des ressources.
                            </p>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                                Télécharger le rapport complet
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default ProfitabilityDashboard;