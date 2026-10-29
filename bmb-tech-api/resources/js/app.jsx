import './bootstrap';
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';

function App() {
    const [view, setView] = useState('home'); // 'home', 'auth', 'admin'
    const [authMode, setAuthMode] = useState('login'); // 'login' ou 'register'
    const [currentUser, setCurrentUser] = useState(null);
    
    const [messages, setMessages] = useState([]);
    const [loadingMessages, setLoadingMessages] = useState(false);

    const [formData, setFormData] = useState({ prenom: '', nom: '', email: '', sujet: '', message: '' });
    const [authData, setAuthData] = useState({ name: '', email: '', password: '' });
    
    const [status, setStatus] = useState('');
    const [authStatus, setAuthStatus] = useState('');
    const [loading, setLoading] = useState(false);

    // Définition de l'email administrateur autorisé
    const ADMIN_EMAIL = 'admin@bmbtech.sn';
    const isAdmin = currentUser && currentUser.email.toLowerCase() === ADMIN_EMAIL;

    useEffect(() => {
        if (view === 'admin' && isAdmin) {
            fetchMessages();
        } else if (view === 'admin' && !isAdmin) {
            setView('home');
        }
    }, [view, currentUser]);

    const fetchMessages = async () => {
        setLoadingMessages(true);
        try {
            const response = await axios.get('/api/contacts');
            setMessages(response.data);
        } catch (error) {
            console.error('Erreur lors du chargement des messages', error);
        } finally {
            setLoadingMessages(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Voulez-vous vraiment supprimer ce message ?')) {
            try {
                await axios.delete(`/api/contacts/${id}`);
                setMessages(messages.filter((msg) => msg.id !== id));
            } catch (error) {
                console.error('Erreur lors de la suppression', error);
            }
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAuthChange = (e) => {
        setAuthData({ ...authData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus('');
        try {
            await axios.post('/api/contacts', formData);
            setStatus('Succès : Votre projet a bien été soumis ! Nos équipes basées à Dakar vous contacteront rapidement.');
            setFormData({ prenom: '', nom: '', email: currentUser ? currentUser.email : '', sujet: '', message: '' });
        } catch (error) {
            setStatus('Erreur : Impossible d\'envoyer le message.');
        } finally {
            setLoading(false);
        }
    };

    const handleAuthSubmit = (e) => {
        e.preventDefault();
        const user = {
            name: authMode === 'register' ? authData.name : (authData.email === ADMIN_EMAIL ? 'Administrateur BMB Tech' : 'Client BMB Tech'),
            email: authData.email
        };
        setCurrentUser(user);
        setFormData(prev => ({ ...prev, email: user.email }));
        setAuthStatus(authMode === 'login' ? 'Connexion réussie !' : 'Compte créé avec succès !');
        setTimeout(() => {
            setAuthStatus('');
            setView('home');
        }, 1000);
    };

    const handleLogout = () => {
        setCurrentUser(null);
        setView('home');
    };

    return (
        <div style={{ 
            fontFamily: 'Inter, system-ui, sans-serif', 
            color: '#1e293b', 
            backgroundColor: currentUser ? '#f1f5f9' : '#070b19', 
            minHeight: '100vh', 
            margin: 0, 
            padding: 0,
            transition: 'background-color 0.4s ease'
        }}>
            
            {/* Barre de navigation */}
            <nav style={{ 
                background: 'rgba(255, 255, 255, 0.9)', 
                backdropFilter: 'blur(16px)', 
                WebkitBackdropFilter: 'blur(16px)',
                borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
                padding: '12px 40px', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                boxShadow: '0 10px 30px rgba(0,0,0,0.04)', 
                position: 'sticky', 
                top: 0, 
                zIndex: 1000 
            }}>
                <div onClick={() => setView('home')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                    <img 
                        src="/logo.png" 
                        alt="BMB Tech Logo" 
                        style={{ 
                            height: '42px', 
                            objectFit: 'contain', 
                            filter: 'drop-shadow(0 0 10px rgba(37, 99, 235, 0.3))'
                        }} 
                    />
                </div>
                
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <button 
                        onClick={() => setView('home')} 
                        style={{ 
                            background: view === 'home' ? '#eff6ff' : 'transparent', 
                            color: view === 'home' ? '#2563eb' : '#475569', 
                            border: 'none', 
                            padding: '9px 18px', 
                            borderRadius: '10px', 
                            cursor: 'pointer', 
                            fontWeight: '600', 
                            fontSize: '0.95rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                        }}
                    >
                        🏠 Accueil
                    </button>

                    {isAdmin && (
                        <button 
                            onClick={() => setView('admin')} 
                            style={{ 
                                background: view === 'admin' ? '#eff6ff' : 'transparent', 
                                color: view === 'admin' ? '#2563eb' : '#475569', 
                                border: 'none', 
                                padding: '9px 18px', 
                                borderRadius: '10px', 
                                cursor: 'pointer', 
                                fontWeight: '600', 
                                fontSize: '0.95rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                            }}
                        >
                            📊 Admin ({messages.length})
                        </button>
                    )}

                    {currentUser ? (
                        <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '12px', 
                            background: '#ffffff', 
                            padding: '5px 5px 5px 14px', 
                            borderRadius: '35px', 
                            border: '1px solid #cbd5e1',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
                        }}>
                            <span style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0f172a' }}>
                                👤 {currentUser.name}
                            </span>
                            <button 
                                onClick={handleLogout} 
                                style={{ 
                                    background: '#fee2e2', 
                                    color: '#991b1b', 
                                    border: 'none', 
                                    padding: '7px 14px', 
                                    borderRadius: '25px', 
                                    cursor: 'pointer', 
                                    fontWeight: '600', 
                                    fontSize: '0.82rem'
                                }}
                            >
                                Déconnexion
                            </button>
                        </div>
                    ) : (
                        <button 
                            onClick={() => { setAuthMode('login'); setView('auth'); }} 
                            style={{ 
                                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', 
                                color: '#fff', 
                                border: 'none', 
                                padding: '10px 22px', 
                                borderRadius: '10px', 
                                cursor: 'pointer', 
                                fontWeight: '600', 
                                fontSize: '0.95rem',
                                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)'
                            }}
                        >
                            🔐 Se connecter
                        </button>
                    )}
                </div>
            </nav>

            {/* Vue Accueil */}
            {view === 'home' && (
                <div>
                    <header style={{ 
                        background: currentUser 
                            ? 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)' 
                            : 'linear-gradient(135deg, #070b19 0%, #0f172a 50%, #1e3a8a 100%)', 
                        color: '#fff', 
                        textAlign: 'center', 
                        padding: currentUser ? '60px 20px 50px 20px' : '90px 20px 70px 20px', 
                        marginBottom: '40px', 
                        boxShadow: '0 10px 30px rgba(0,0,0,0.15)' 
                    }}>
                        <div style={{ marginBottom: '20px' }}>
                            <img 
                                src="/logo.png" 
                                alt="BMB Tech Grand Logo" 
                                style={{ 
                                    height: currentUser ? '80px' : '110px', 
                                    objectFit: 'contain', 
                                    filter: 'drop-shadow(0 8px 25px rgba(217, 119, 6, 0.5))' 
                                }} 
                            />
                        </div>
                        <h1 style={{ fontSize: currentUser ? '2rem' : '2.5rem', fontWeight: '800', margin: '0 0 10px 0', letterSpacing: '-0.5px' }}>
                            {currentUser ? `Espace Partenaire - BMB Tech Dakar` : `BMB TECH DAKAR`}
                        </h1>
                        <p style={{ fontSize: '1.15rem', margin: '0 auto 25px auto', maxWidth: '650px', opacity: '0.9', lineHeight: '1.6', color: '#e2e8f0' }}>
                            {currentUser 
                                ? `Bienvenue dans votre tableau de bord personnalisé. Découvrez nos expertises et nos réalisations.` 
                                : `Innover • Développer • Réaliser vos projets numériques avec excellence au Sénégal.`}
                        </p>
                        
                        {!currentUser && (
                            <div style={{ display: 'flex', gap: '18px', justifyContent: 'center' }}>
                                <button onClick={() => { setAuthMode('login'); setView('auth'); }} style={{ background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', color: '#fff', border: 'none', padding: '15px 32px', fontSize: '1rem', fontWeight: 'bold', borderRadius: '10px', cursor: 'pointer', boxShadow: '0 8px 20px rgba(37, 99, 235, 0.4)' }}>
                                    Espace Client : Se connecter
                                </button>
                                <button onClick={() => { setAuthMode('register'); setView('auth'); }} style={{ background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)', color: '#fff', border: 'none', padding: '15px 32px', fontSize: '1rem', fontWeight: 'bold', borderRadius: '10px', cursor: 'pointer', boxShadow: '0 8px 20px rgba(217, 119, 6, 0.4)' }}>
                                    Créer un compte
                                </button>
                            </div>
                        )}
                    </header>

                    <div style={{ maxWidth: '950px', margin: '0 auto', padding: '0 20px 80px 20px', display: 'flex', flexDirection: 'column', gap: '45px' }}>
                        
                        {/* SECTION DE L'AFFICHE (Masquée après connexion) */}
                        {!currentUser && (
                            <section style={{ 
                                background: '#111827', 
                                padding: '20px', 
                                borderRadius: '20px', 
                                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)', 
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                textAlign: 'center'
                            }}>
                                <div style={{ marginBottom: '16px' }}>
                                    <h3 style={{ color: '#ffffff', fontSize: '1.4rem', fontWeight: '800', margin: '0 0 4px 0' }}>BMB Tech en Action</h3>
                                    <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0 }}>Votre vision, notre expertise</p>
                                </div>
                                <div style={{ borderRadius: '12px', overflow: 'hidden', background: '#000', boxShadow: '0 8px 25px rgba(0,0,0,0.3)', display: 'flex', justifyContent: 'center' }}>
                                    <img 
                                        src="/annonce.png" 
                                        alt="Affiche BMB Tech" 
                                        style={{ 
                                            width: '100%', 
                                            maxHeight: '600px', 
                                            objectFit: 'contain', 
                                            display: 'block'
                                        }} 
                                    />
                                </div>
                            </section>
                        )}

                        {/* SECTION VISIBLE UNIQUEMENT APRÈS CONNEXION */}
                        {currentUser && (
                            <>
                                <div style={{ 
                                    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)', 
                                    padding: '30px', 
                                    borderRadius: '20px', 
                                    boxShadow: '0 10px 30px rgba(37, 99, 235, 0.08)', 
                                    border: '2px solid #3b82f6',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    flexWrap: 'wrap',
                                    gap: '20px'
                                }}>
                                    <div>
                                        <span style={{ background: '#dbeafe', color: '#1e40af', padding: '6px 14px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase' }}>
                                            Session Active
                                        </span>
                                        <h2 style={{ color: '#0f172a', margin: '12px 0 6px 0', fontSize: '1.6rem', fontWeight: '800' }}>
                                            Heureux de vous compter parmi nous, {currentUser.name} !
                                        </h2>
                                        <p style={{ color: '#64748b', margin: 0, fontSize: '0.95rem' }}>
                                            Découvrez ci-dessous nos expertises et nos réalisations aux couleurs de BMB Tech.
                                        </p>
                                    </div>
                                    <div style={{ fontSize: '3rem' }}>🚀</div>
                                </div>

                                <section>
                                    <h2 style={{ textAlign: 'center', color: '#0f172a', marginBottom: '30px', fontSize: '1.8rem', fontWeight: '800' }}>Nos Domaines d'Expertise</h2>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px' }}>
                                        <div style={{ background: '#ffffff', padding: '30px', borderRadius: '16px', boxShadow: '0 10px 25px rgba(15, 23, 42, 0.05)', border: '1px solid #e2e8f0' }}>
                                            <div style={{ fontSize: '2.2rem', marginBottom: '15px' }}>💻</div>
                                            <h3 style={{ color: '#0f172a', marginTop: '0', fontSize: '1.25rem', fontWeight: '700' }}>Génie Logiciel</h3>
                                            <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: '1.6' }}>Conception et développement d'applications web et mobiles robustes et évolutives.</p>
                                        </div>
                                        <div style={{ background: '#ffffff', padding: '30px', borderRadius: '16px', boxShadow: '0 10px 25px rgba(15, 23, 42, 0.05)', border: '1px solid #e2e8f0' }}>
                                            <div style={{ fontSize: '2.2rem', marginBottom: '15px' }}>🌐</div>
                                            <h3 style={{ color: '#0f172a', marginTop: '0', fontSize: '1.25rem', fontWeight: '700' }}>Administration Réseaux</h3>
                                            <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: '1.6' }}>Mise en place, sécurisation et optimisation d'infrastructures téléinformatiques.</p>
                                        </div>
                                        <div style={{ background: '#ffffff', padding: '30px', borderRadius: '16px', boxShadow: '0 10px 25px rgba(15, 23, 42, 0.05)', border: '1px solid #e2e8f0' }}>
                                            <div style={{ fontSize: '2.2rem', marginBottom: '15px' }}>⚙️</div>
                                            <h3 style={{ color: '#0f172a', marginTop: '0', fontSize: '1.25rem', fontWeight: '700' }}>Transformation Digitale</h3>
                                            <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: '1.6' }}>Accompagnement stratégique et technologique pour moderniser vos processus.</p>
                                        </div>
                                    </div>
                                </section>

                                <section>
                                    <h2 style={{ textAlign: 'center', color: '#0f172a', marginBottom: '30px', fontSize: '1.8rem', fontWeight: '800' }}>Nos Réalisations</h2>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px' }}>
                                        
                                        {/* Réalisation 1 : Famille Mbow Yelli (Avec son image MYF.png) */}
                                        <div style={{ background: '#ffffff', padding: '25px', borderRadius: '16px', boxShadow: '0 10px 25px rgba(15, 23, 42, 0.05)', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                            <div>
                                                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                                                    <div style={{ 
                                                        width: '130px', 
                                                        height: '130px', 
                                                        borderRadius: '50%', 
                                                        overflow: 'hidden', 
                                                        border: '4px solid #2563eb', 
                                                        boxShadow: '0 10px 25px rgba(37, 99, 235, 0.35)', 
                                                        background: '#044e39',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                                                    }}>
                                                        <img 
                                                            src="/MYF.png" 
                                                            alt="Plateforme Mbow Yelli" 
                                                            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} 
                                                        />
                                                    </div>
                                                </div>

                                                <h3 style={{ color: '#0f172a', marginTop: '0', fontSize: '1.15rem', fontWeight: '700', textAlign: 'center' }}>Plateforme Famille Mbow Yelli</h3>
                                                <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.5', textAlign: 'center' }}>Application dédiée à la gestion des membres, au suivi des cotisations et à l'organisation de réunions en ligne.</p>
                                                <div style={{ marginTop: '15px', display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'center' }}>
                                                    <span style={{ background: '#eff6ff', color: '#2563eb', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '600' }}>PHP</span>
                                                    <span style={{ background: '#eff6ff', color: '#2563eb', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '600' }}>MySQL</span>
                                                </div>
                                            </div>
                                            <div style={{ marginTop: '20px', textAlign: 'center' }}>
                                                <a href="https://mbowyelli.infinityfreeapp.com/index.php" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', color: '#fff', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontWeight: '600', fontSize: '0.85rem', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)' }}>
                                                    🔗 Visiter la réalisation →
                                                </a>
                                            </div>
                                        </div>

                                        {/* Réalisation 2 : Portfolio Professionnel (Avec le logo BMB Tech) */}
                                        <div style={{ background: '#ffffff', padding: '25px', borderRadius: '16px', boxShadow: '0 10px 25px rgba(15, 23, 42, 0.05)', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                            <div>
                                                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                                                    <div style={{ 
                                                        width: '130px', 
                                                        height: '130px', 
                                                        borderRadius: '50%', 
                                                        overflow: 'hidden', 
                                                        background: '#070b19', 
                                                        display: 'flex', 
                                                        alignItems: 'center', 
                                                        justifyContent: 'center', 
                                                        border: '4px solid #2563eb',
                                                        boxShadow: '0 10px 25px rgba(37, 99, 235, 0.35)',
                                                        transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                                                    }}>
                                                        <img 
                                                            src="/logo.png" 
                                                            alt="BMB Tech Logo" 
                                                            style={{ width: '85%', height: '85%', objectFit: 'contain', display: 'block' }} 
                                                        />
                                                    </div>
                                                </div>
                                                <h3 style={{ color: '#0f172a', marginTop: '0', fontSize: '1.15rem', fontWeight: '700', textAlign: 'center' }}>Portfolio Professionnel</h3>
                                                <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.5', textAlign: 'center' }}>Site personnel regroupant l'ensemble de mon parcours, mes compétences et mes projets de développement web.</p>
                                                <div style={{ marginTop: '15px', display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'center' }}>
                                                    <span style={{ background: '#eff6ff', color: '#2563eb', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '600' }}>Web</span>
                                                    <span style={{ background: '#eff6ff', color: '#2563eb', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '600' }}>Portfolio</span>
                                                </div>
                                            </div>
                                            <div style={{ marginTop: '20px', textAlign: 'center' }}>
                                                <a href="https://babacar.infinityfreeapp.com/" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', color: '#fff', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontWeight: '600', fontSize: '0.85rem', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)' }}>
                                                    🔗 Visiter le Portfolio →
                                                </a>
                                            </div>
                                        </div>

                                        {/* Réalisation 3 : Portail de Santé Numérique (Avec le logo BMB Tech) */}
                                        <div style={{ background: '#ffffff', padding: '25px', borderRadius: '16px', boxShadow: '0 10px 25px rgba(15, 23, 42, 0.05)', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                            <div>
                                                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                                                    <div style={{ 
                                                        width: '130px', 
                                                        height: '130px', 
                                                        borderRadius: '50%', 
                                                        overflow: 'hidden', 
                                                        background: '#070b19', 
                                                        display: 'flex', 
                                                        alignItems: 'center', 
                                                        justifyContent: 'center', 
                                                        border: '4px solid #1e3a8a',
                                                        boxShadow: '0 10px 25px rgba(15, 23, 42, 0.3)',
                                                        transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                                                    }}>
                                                        <img 
                                                            src="/logo.png" 
                                                            alt="BMB Tech Logo" 
                                                            style={{ width: '85%', height: '85%', objectFit: 'contain', display: 'block' }} 
                                                        />
                                                    </div>
                                                </div>
                                                <h3 style={{ color: '#0f172a', marginTop: '0', fontSize: '1.15rem', fontWeight: '700', textAlign: 'center' }}>Portail de Santé Numérique</h3>
                                                <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.5', textAlign: 'center' }}>Système informatisé de gestion de dossiers patients et de prise de rendez-vous pour des cliniques privées.</p>
                                                <div style={{ marginTop: '15px', display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'center' }}>
                                                    <span style={{ background: '#eff6ff', color: '#2563eb', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '600' }}>PHP / Laravel</span>
                                                    <span style={{ background: '#eff6ff', color: '#2563eb', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '600' }}>JavaScript</span>
                                                </div>
                                            </div>
                                            <div style={{ marginTop: '20px', textAlign: 'center' }}>
                                                <a href="https://example.com/sante" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', color: '#fff', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontWeight: '600', fontSize: '0.85rem', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)' }}>
                                                    🔗 Visiter la réalisation →
                                                </a>
                                            </div>
                                        </div>

                                    </div>
                                </section>

                                <section style={{ background: '#ffffff', padding: '45px', borderRadius: '20px', boxShadow: '0 15px 35px rgba(15, 23, 42, 0.06)', border: '1px solid #e2e8f0' }}>
                                    <h2 style={{ textAlign: 'center', color: '#0f172a', marginTop: '0', fontSize: '1.8rem', fontWeight: '800' }}>Parlons de votre projet</h2>
                                    <p style={{ textAlign: 'center', color: '#64748b', marginBottom: '30px', fontSize: '1rem' }}>
                                        Remplissez le formulaire ci-dessous pour soumettre votre projet directement à notre équipe technique à Dakar.
                                    </p>

                                    {status && (
                                        <div style={{ padding: '15px', marginBottom: '25px', borderRadius: '12px', textAlign: 'center', backgroundColor: status.includes('Succès') ? '#dcfce7' : '#fee2e2', color: status.includes('Succès') ? '#166534' : '#991b1b', fontWeight: '600', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                                            {status}
                                        </div>
                                    )}

                                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                        <div style={{ display: 'flex', gap: '20px' }}>
                                            <input type="text" name="prenom" placeholder="Prénom" value={formData.prenom} onChange={handleChange} required style={{ flex: 1, padding: '14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '1rem', outline: 'none', background: '#f8fafc' }} />
                                            <input type="text" name="nom" placeholder="Nom" value={formData.nom} onChange={handleChange} required style={{ flex: 1, padding: '14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '1rem', outline: 'none', background: '#f8fafc' }} />
                                        </div>
                                        <input type="email" name="email" placeholder="Adresse Email" value={formData.email} onChange={handleChange} required style={{ padding: '14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '1rem', outline: 'none', background: '#f8fafc' }} />
                                        <input type="text" name="sujet" placeholder="Sujet / Intitulé du projet" value={formData.sujet} onChange={handleChange} required style={{ padding: '14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '1rem', outline: 'none', background: '#f8fafc' }} />
                                        <textarea name="message" placeholder="Détaillez vos besoins ou cahier des charges..." rows="5" value={formData.message} onChange={handleChange} required style={{ padding: '14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '1rem', outline: 'none', resize: 'vertical', background: '#f8fafc' }}></textarea>
                                        <button type="submit" disabled={loading} style={{ padding: '16px', background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '1.05rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 6px 20px rgba(37, 99, 235, 0.4)' }}>
                                            {loading ? 'Envoi en cours...' : '🚀 Soumettre mon projet'}
                                        </button>
                                    </form>
                                </section>
                            </>
                        )}

                    </div>
                </div>
            )}

            {/* Vue Authentification */}
            {view === 'auth' && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '80px 20px', minHeight: '85vh' }}>
                    <div style={{ background: '#ffffff', padding: '40px', borderRadius: '20px', boxShadow: '0 20px 40px rgba(0,0,0,0.3)', width: '100%', maxWidth: '420px', border: '1px solid #e2e8f0' }}>
                        
                        <div style={{ textAlign: 'center', marginBottom: '25px' }}>
                            <img src="/logo.png" alt="BMB Tech Logo" style={{ height: '60px', objectFit: 'contain' }} />
                            <h2 style={{ color: '#0f172a', margin: '15px 0 5px 0', fontSize: '1.5rem', fontWeight: '800' }}>
                                {authMode === 'login' ? 'Bon retour !' : 'Créer un compte'}
                            </h2>
                            <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>Accédez à l'écosystème BMB Tech</p>
                        </div>

                        <div style={{ display: 'flex', marginBottom: '25px', background: '#f1f5f9', padding: '4px', borderRadius: '10px' }}>
                            <button onClick={() => setAuthMode('login')} style={{ flex: 1, padding: '10px', background: authMode === 'login' ? '#ffffff' : 'transparent', color: authMode === 'login' ? '#2563eb' : '#64748b', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                                Connexion
                            </button>
                            <button onClick={() => setAuthMode('register')} style={{ flex: 1, padding: '10px', background: authMode === 'register' ? '#ffffff' : 'transparent', color: authMode === 'register' ? '#2563eb' : '#64748b', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                                Inscription
                            </button>
                        </div>

                        {authStatus && (
                            <div style={{ padding: '12px', marginBottom: '20px', borderRadius: '8px', textAlign: 'center', backgroundColor: '#dcfce7', color: '#166534', fontWeight: '600' }}>
                                {authStatus}
                            </div>
                        )}

                        <form onSubmit={handleAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {authMode === 'register' && (
                                <input type="text" name="name" placeholder="Nom complet" value={authData.name} onChange={handleAuthChange} required style={{ padding: '14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '1rem', outline: 'none' }} />
                            )}
                            <input type="email" name="email" placeholder="Adresse Email (ex: admin@bmbtech.sn)" value={authData.email} onChange={handleAuthChange} required style={{ padding: '14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '1rem', outline: 'none' }} />
                            <input type="password" name="password" placeholder="Mot de passe" value={authData.password} onChange={handleAuthChange} required style={{ padding: '14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '1rem', outline: 'none' }} />
                            
                            <button type="submit" style={{ marginTop: '10px', padding: '15px', background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 15px rgba(37, 99, 235, 0.3)' }}>
                                {authMode === 'login' ? 'Se connecter' : "S'inscrire"}
                            </button>
                        </form>

                        <div style={{ textAlign: 'center', marginTop: '25px' }}>
                            <button onClick={() => setView('home')} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '600' }}>
                                ← Retour à l'accueil
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Vue Admin */}
            {view === 'admin' && isAdmin && (
                <div style={{ maxWidth: '950px', margin: '50px auto', padding: '0 20px 80px 20px' }}>
                    <div style={{ 
                        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', 
                        padding: '30px 40px', 
                        borderRadius: '20px', 
                        boxShadow: '0 20px 40px rgba(0,0,0,0.2)', 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        marginBottom: '35px',
                        color: '#fff',
                        flexWrap: 'wrap',
                        gap: '20px'
                    }}>
                        <div>
                            <span style={{ background: '#3b82f6', color: '#fff', padding: '5px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase' }}>
                                Administration Sécurisée
                            </span>
                            <h2 style={{ margin: '10px 0 5px 0', fontSize: '1.8rem', fontWeight: '800' }}>
                                Tableau de bord - Messages reçus
                            </h2>
                            <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.95rem' }}>
                                Gérez les demandes et projets soumis par vos clients ({messages.length} message{messages.length > 1 ? 's' : ''}).
                            </p>
                        </div>
                        <button 
                            onClick={() => setView('home')} 
                            style={{ 
                                background: 'rgba(255,255,255,0.1)', 
                                color: '#fff', 
                                border: '1px solid rgba(255,255,255,0.2)', 
                                padding: '12px 22px', 
                                borderRadius: '10px', 
                                fontWeight: '600', 
                                cursor: 'pointer'
                            }}
                        >
                            ← Retour au site
                        </button>
                    </div>

                    {loadingMessages ? (
                        <div style={{ textAlign: 'center', padding: '50px', color: '#64748b', fontSize: '1.1rem' }}>
                            Chargement des messages en cours...
                        </div>
                    ) : messages.length === 0 ? (
                        <div style={{ 
                            background: '#ffffff', 
                            padding: '60px 30px', 
                            borderRadius: '20px', 
                            textAlign: 'center', 
                            boxShadow: '0 10px 30px rgba(0,0,0,0.05)', 
                            border: '1px solid #e2e8f0' 
                        }}>
                            <div style={{ fontSize: '3rem', marginBottom: '15px' }}>📭</div>
                            <h3 style={{ color: '#0f172a', margin: '0 0 8px 0', fontSize: '1.25rem' }}>Aucun message pour le moment</h3>
                            <p style={{ color: '#64748b', margin: 0 }}>Les soumissions de projets de vos clients apparaîtront ici.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {messages.map((msg) => (
                                <div key={msg.id} style={{ 
                                    background: '#ffffff', 
                                    padding: '30px', 
                                    borderRadius: '16px', 
                                    boxShadow: '0 10px 30px rgba(15, 23, 42, 0.05)', 
                                    border: '1px solid #e2e8f0',
                                    position: 'relative'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', borderBottom: '1px solid #f1f5f9', paddingBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.1rem' }}>
                                                {msg.prenom ? msg.prenom.charAt(0).toUpperCase() : 'U'}
                                            </div>
                                            <div>
                                                <strong style={{ color: '#0f172a', fontSize: '1.1rem', display: 'block' }}>{msg.prenom} {msg.nom}</strong>
                                                <span style={{ color: '#64748b', fontSize: '0.85rem' }}>ID: #{msg.id}</span>
                                            </div>
                                        </div>
                                        <span style={{ background: '#f8fafc', color: '#334155', border: '1px solid #cbd5e1', padding: '6px 14px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '600' }}>
                                            ✉️ {msg.email}
                                        </span>
                                    </div>

                                    <div style={{ marginBottom: '15px' }}>
                                        <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Sujet du projet</span>
                                        <h4 style={{ margin: '4px 0 0 0', color: '#0f172a', fontSize: '1.15rem' }}>{msg.sujet}</h4>
                                    </div>

                                    <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
                                        <p style={{ margin: 0, color: '#475569', lineHeight: '1.6', fontSize: '0.95rem', whiteSpace: 'pre-line' }}>{msg.message}</p>
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        <button 
                                            onClick={() => handleDelete(msg.id)} 
                                            style={{ 
                                                background: '#fee2e2', 
                                                color: '#991b1b', 
                                                border: 'none', 
                                                padding: '10px 20px', 
                                                borderRadius: '8px', 
                                                cursor: 'pointer', 
                                                fontSize: '0.9rem', 
                                                fontWeight: '700',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px'
                                            }}
                                        >
                                            🗑️ Supprimer ce message
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

if (document.getElementById('app')) {
    const root = ReactDOM.createRoot(document.getElementById('app'));
    root.render(<App />);
}