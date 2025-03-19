import { useState } from "react";
import { FaUser, FaLock, FaEnvelope, FaCalendar, FaMapMarkerAlt, FaVenusMars, FaCreditCard, FaIdCard } from "react-icons/fa";

function Register() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        birthDate: "",
        birthPlace: "",
        address: "",
        gender: "",
        otherGender: "",

        cardNumber: "",
        expiryDate: "",
        cvv: "",
        acceptTerms: false,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    return (
        <div className="flex items-center justify-center w-screen bg-gradient-to-br from-blue-100 to-purple-100 p-6"
             style={{ height: "calc(200vh)" }}>
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
                <h2 className="text-4xl font-bold text-center text-gray-800 mb-6">Registrati</h2>
                <form className="flex flex-col gap-4">
                    {/* Nome */}
                    <label className="text-gray-700 font-medium">Nome</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="border p-3 rounded-lg" placeholder="Inserisci il tuo nome" />

                    {/* Email */}
                    <label className="text-gray-700 font-medium">Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="border p-3 rounded-lg" placeholder="Inserisci la tua email" />

                    {/* Data di nascita */}
                    <label className="text-gray-700 font-medium">Data di nascita</label>
                    <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} className="border p-3 rounded-lg" />

                    {/* Luogo di nascita */}
                    <label className="text-gray-700 font-medium">Luogo di nascita</label>
                    <input type="text" name="birthPlace" value={formData.birthPlace} onChange={handleChange} className="border p-3 rounded-lg" placeholder="Inserisci il luogo di nascita" />

                    {/* Indirizzo */}
                    <label className="text-gray-700 font-medium">Indirizzo</label>
                    <input type="text" name="address" value={formData.address} onChange={handleChange} className="border p-3 rounded-lg" placeholder="Inserisci il tuo indirizzo" />

                    {/* Sesso con Combo Box */}
                    <label className="text-gray-700 font-medium">Sesso</label>
                    <select name="gender" value={formData.gender} onChange={handleChange} className="border p-3 rounded-lg">
                        <option value="">Seleziona</option>
                        <option value="maschio">Maschio</option>
                        <option value="femmina">Femmina</option>
                        <option value="altro">Altro</option>
                    </select>
                    {formData.gender === "altro" && (
                        <input type="text" name="otherGender" value={formData.otherGender} onChange={handleChange} className="border p-3 rounded-lg" placeholder="Specifica il tuo genere" />
                    )}

                    {/* Carta di credito */}
                    <label className="text-gray-700 font-medium">Numero Carta di Credito</label>
                    <input type="text" name="cardNumber" value={formData.cardNumber} onChange={handleChange} className="border p-3 rounded-lg" placeholder="Inserisci il numero della carta" />

                    <div className="flex gap-4">
                        {/* Data di scadenza */}
                        <div className="flex-1">
                            <label className="text-gray-700 font-medium">Data di scadenza</label>
                            <input type="month" name="expiryDate" value={formData.expiryDate} onChange={handleChange} className="border p-3 rounded-lg w-full" />
                        </div>

                        {/* CVV */}
                        <div className="flex-1">
                            <label className="text-gray-700 font-medium">CVV</label>
                            <input type="text" name="cvv" value={formData.cvv} onChange={handleChange} className="border p-3 rounded-lg w-full" placeholder="CVV" />
                        </div>
                    </div>

                    {/* Password */}
                    <label className="text-gray-700 font-medium">Password</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} className="border p-3 rounded-lg" placeholder="Inserisci la tua password" />

                    {/* Conferma Password */}
                    <label className="text-gray-700 font-medium">Conferma Password</label>
                    <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="border p-3 rounded-lg" placeholder="Ripeti la password" />

                    {/* Accettazione trattamento dati */}
                    <div className="flex items-center">
                        <input type="checkbox" name="acceptTerms" checked={formData.acceptTerms} onChange={handleChange} className="w-5 h-5 mr-2" />
                        <label className="text-gray-700 text-sm">Accetto il trattamento dei dati personali</label>
                    </div>

                    {/* Pulsante Registrati */}
                    <button type="button" className="w-full bg-purple-500 text-white py-3 rounded-lg font-semibold text-xl hover:bg-purple-600 transition duration-300">Registrati</button>
                </form>
            </div>
        </div>
    );
}

export default Register;
