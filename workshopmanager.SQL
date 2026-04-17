/* =========================================================
   BASE DE DONNÉES : GarageMecaniqueDB
   CIBLE            : SQL Server
   OBJET            : Gestion atelier mécanique automobile
   ========================================================= */

SET NOCOUNT ON;
GO

/* =========================================================
   0) CRÉATION DE LA BASE
   ========================================================= */
IF DB_ID(N'GarageMecaniqueDB') IS NULL
BEGIN
    CREATE DATABASE GarageMecaniqueDB;
END
GO

USE GarageMecaniqueDB;
GO

/* =========================================================
   1) CRÉATION DU SCHÉMA
   ========================================================= */
IF NOT EXISTS (SELECT 1 FROM sys.schemas WHERE name = N'garage')
BEGIN
    EXEC('CREATE SCHEMA garage');
END
GO

/* =========================================================
   2) TABLES DE RÉFÉRENCE
   ========================================================= */

IF OBJECT_ID(N'garage.ModePaiement', N'U') IS NULL
BEGIN
    CREATE TABLE garage.ModePaiement
    (
        ModePaiementID       TINYINT        NOT NULL,
        Libelle              NVARCHAR(50)   NOT NULL,
        CONSTRAINT PK_ModePaiement PRIMARY KEY (ModePaiementID),
        CONSTRAINT UQ_ModePaiement_Libelle UNIQUE (Libelle)
    );
END
GO

IF OBJECT_ID(N'garage.StatutOrdreReparation', N'U') IS NULL
BEGIN
    CREATE TABLE garage.StatutOrdreReparation
    (
        StatutOrdreID        TINYINT        NOT NULL,
        Libelle              NVARCHAR(50)   NOT NULL,
        CONSTRAINT PK_StatutOrdreReparation PRIMARY KEY (StatutOrdreID),
        CONSTRAINT UQ_StatutOrdreReparation_Libelle UNIQUE (Libelle)
    );
END
GO

IF OBJECT_ID(N'garage.StatutFacture', N'U') IS NULL
BEGIN
    CREATE TABLE garage.StatutFacture
    (
        StatutFactureID      TINYINT        NOT NULL,
        Libelle              NVARCHAR(50)   NOT NULL,
        CONSTRAINT PK_StatutFacture PRIMARY KEY (StatutFactureID),
        CONSTRAINT UQ_StatutFacture_Libelle UNIQUE (Libelle)
    );
END
GO

IF OBJECT_ID(N'garage.StatutAchat', N'U') IS NULL
BEGIN
    CREATE TABLE garage.StatutAchat
    (
        StatutAchatID        TINYINT        NOT NULL,
        Libelle              NVARCHAR(50)   NOT NULL,
        CONSTRAINT PK_StatutAchat PRIMARY KEY (StatutAchatID),
        CONSTRAINT UQ_StatutAchat_Libelle UNIQUE (Libelle)
    );
END
GO

IF OBJECT_ID(N'garage.TypeMouvementStock', N'U') IS NULL
BEGIN
    CREATE TABLE garage.TypeMouvementStock
    (
        TypeMouvementStockID TINYINT        NOT NULL,
        Libelle              NVARCHAR(50)   NOT NULL,
        ImpactStock          SMALLINT       NOT NULL,
        CONSTRAINT PK_TypeMouvementStock PRIMARY KEY (TypeMouvementStockID),
        CONSTRAINT UQ_TypeMouvementStock_Libelle UNIQUE (Libelle),
        CONSTRAINT CK_TypeMouvementStock_Impact CHECK (ImpactStock IN (-1, 1))
    );
END
GO

/* =========================================================
   3) INSERTION DES DONNÉES DE BASE
   ========================================================= */

IF NOT EXISTS (SELECT 1 FROM garage.ModePaiement)
BEGIN
    INSERT INTO garage.ModePaiement (ModePaiementID, Libelle)
    VALUES
        (1, N'Espèces'),
        (2, N'Carte bancaire'),
        (3, N'Virement'),
        (4, N'Chèque'),
        (5, N'Paiement mobile');
END
GO

IF NOT EXISTS (SELECT 1 FROM garage.StatutOrdreReparation)
BEGIN
    INSERT INTO garage.StatutOrdreReparation (StatutOrdreID, Libelle)
    VALUES
        (1, N'En attente'),
        (2, N'En cours'),
        (3, N'Terminé'),
        (4, N'Livré'),
        (5, N'Annulé');
END
GO

IF NOT EXISTS (SELECT 1 FROM garage.StatutFacture)
BEGIN
    INSERT INTO garage.StatutFacture (StatutFactureID, Libelle)
    VALUES
        (1, N'Brouillon'),
        (2, N'Validée'),
        (3, N'Partiellement payée'),
        (4, N'Payée'),
        (5, N'Annulée');
END
GO

IF NOT EXISTS (SELECT 1 FROM garage.StatutAchat)
BEGIN
    INSERT INTO garage.StatutAchat (StatutAchatID, Libelle)
    VALUES
        (1, N'Brouillon'),
        (2, N'Commandé'),
        (3, N'Reçu partiellement'),
        (4, N'Reçu'),
        (5, N'Annulé');
END
GO

IF NOT EXISTS (SELECT 1 FROM garage.TypeMouvementStock)
BEGIN
    INSERT INTO garage.TypeMouvementStock (TypeMouvementStockID, Libelle, ImpactStock)
    VALUES
        (1, N'Entrée achat', 1),
        (2, N'Sortie ordre réparation', -1),
        (3, N'Ajustement positif', 1),
        (4, N'Ajustement négatif', -1),
        (5, N'Retour client', 1),
        (6, N'Retour fournisseur', -1),
        (7, N'Stock initial', 1),
        (8, N'Correction inventaire', 1);
END
GO

/* =========================================================
   4) TABLES PRINCIPALES
   ========================================================= */

IF OBJECT_ID(N'garage.Client', N'U') IS NULL
BEGIN
    CREATE TABLE garage.Client
    (
        ClientID             INT IDENTITY(1,1) NOT NULL,
        CodeClient           NVARCHAR(30)      NULL,
        TypeClient           NVARCHAR(20)      NOT NULL CONSTRAINT DF_Client_TypeClient DEFAULT (N'Particulier'),
        Nom                  NVARCHAR(100)     NULL,
        Prenom               NVARCHAR(100)     NULL,
        RaisonSociale        NVARCHAR(150)     NULL,
        Telephone            NVARCHAR(30)      NOT NULL,
        Telephone2           NVARCHAR(30)      NULL,
        Email                NVARCHAR(150)     NULL,
        Adresse              NVARCHAR(250)     NULL,
        Ville                NVARCHAR(100)     NULL,
        CodePostal           NVARCHAR(20)      NULL,
        NIF                  NVARCHAR(50)      NULL,
        RC                   NVARCHAR(50)      NULL,
        PlafondCredit        DECIMAL(18,2)     NOT NULL CONSTRAINT DF_Client_PlafondCredit DEFAULT (0),
        Notes                NVARCHAR(1000)    NULL,
        Actif                BIT               NOT NULL CONSTRAINT DF_Client_Actif DEFAULT (1),
        DateCreation         DATETIME2(0)      NOT NULL CONSTRAINT DF_Client_DateCreation DEFAULT (SYSUTCDATETIME()),
        DateModification     DATETIME2(0)      NULL,
        CONSTRAINT PK_Client PRIMARY KEY (ClientID),
        CONSTRAINT CK_Client_TypeClient CHECK (TypeClient IN (N'Particulier', N'Société')),
        CONSTRAINT CK_Client_Identite CHECK
        (
            (RaisonSociale IS NOT NULL AND LTRIM(RTRIM(RaisonSociale)) <> N'')
            OR
            (Nom IS NOT NULL AND LTRIM(RTRIM(Nom)) <> N'')
        ),
        CONSTRAINT CK_Client_PlafondCredit CHECK (PlafondCredit >= 0)
    );
END
GO

IF OBJECT_ID(N'garage.Fournisseur', N'U') IS NULL
BEGIN
    CREATE TABLE garage.Fournisseur
    (
        FournisseurID        INT IDENTITY(1,1) NOT NULL,
        CodeFournisseur      NVARCHAR(30)      NULL,
        RaisonSociale        NVARCHAR(150)     NOT NULL,
        Responsable          NVARCHAR(150)     NULL,
        Telephone            NVARCHAR(30)      NOT NULL,
        Telephone2           NVARCHAR(30)      NULL,
        Email                NVARCHAR(150)     NULL,
        Adresse              NVARCHAR(250)     NULL,
        Ville                NVARCHAR(100)     NULL,
        CodePostal           NVARCHAR(20)      NULL,
        NIF                  NVARCHAR(50)      NULL,
        RC                   NVARCHAR(50)      NULL,
        ConditionsPaiement   NVARCHAR(100)     NULL,
        Notes                NVARCHAR(1000)    NULL,
        Actif                BIT               NOT NULL CONSTRAINT DF_Fournisseur_Actif DEFAULT (1),
        DateCreation         DATETIME2(0)      NOT NULL CONSTRAINT DF_Fournisseur_DateCreation DEFAULT (SYSUTCDATETIME()),
        DateModification     DATETIME2(0)      NULL,
        CONSTRAINT PK_Fournisseur PRIMARY KEY (FournisseurID)
    );
END
GO

IF OBJECT_ID(N'garage.Employe', N'U') IS NULL
BEGIN
    CREATE TABLE garage.Employe
    (
        EmployeID            INT IDENTITY(1,1) NOT NULL,
        Nom                  NVARCHAR(100)     NOT NULL,
        Prenom               NVARCHAR(100)     NULL,
        Fonction             NVARCHAR(100)     NULL,
        Telephone            NVARCHAR(30)      NULL,
        Email                NVARCHAR(150)     NULL,
        Actif                BIT               NOT NULL CONSTRAINT DF_Employe_Actif DEFAULT (1),
        DateCreation         DATETIME2(0)      NOT NULL CONSTRAINT DF_Employe_DateCreation DEFAULT (SYSUTCDATETIME()),
        CONSTRAINT PK_Employe PRIMARY KEY (EmployeID)
    );
END
GO

IF OBJECT_ID(N'garage.Vehicule', N'U') IS NULL
BEGIN
    CREATE TABLE garage.Vehicule
    (
        VehiculeID           INT IDENTITY(1,1) NOT NULL,
        ClientID             INT               NOT NULL,
        Immatriculation      NVARCHAR(30)      NOT NULL,
        Marque               NVARCHAR(100)     NOT NULL,
        Modele               NVARCHAR(100)     NOT NULL,
        Annee                SMALLINT          NULL,
        Carburant            NVARCHAR(20)      NULL,
        VIN                  NVARCHAR(50)      NULL,
        Couleur              NVARCHAR(50)      NULL,
        KilometrageActuel    INT               NOT NULL CONSTRAINT DF_Vehicule_KilometrageActuel DEFAULT (0),
        DateMiseEnService    DATE              NULL,
        Notes                NVARCHAR(1000)    NULL,
        Actif                BIT               NOT NULL CONSTRAINT DF_Vehicule_Actif DEFAULT (1),
        DateCreation         DATETIME2(0)      NOT NULL CONSTRAINT DF_Vehicule_DateCreation DEFAULT (SYSUTCDATETIME()),
        DateModification     DATETIME2(0)      NULL,
        CONSTRAINT PK_Vehicule PRIMARY KEY (VehiculeID),
        CONSTRAINT FK_Vehicule_Client FOREIGN KEY (ClientID) REFERENCES garage.Client(ClientID),
        CONSTRAINT CK_Vehicule_Carburant CHECK
        (
            Carburant IS NULL OR
            Carburant IN (N'Essence', N'Diesel', N'GPL', N'Hybride', N'Électrique')
        ),
        CONSTRAINT CK_Vehicule_Annee CHECK (Annee IS NULL OR Annee BETWEEN 1950 AND 2100),
        CONSTRAINT CK_Vehicule_Kilometrage CHECK (KilometrageActuel >= 0)
    );
END
GO

IF OBJECT_ID(N'garage.CategoriePiece', N'U') IS NULL
BEGIN
    CREATE TABLE garage.CategoriePiece
    (
        CategoriePieceID     INT IDENTITY(1,1) NOT NULL,
        CodeCategorie        NVARCHAR(30)      NULL,
        Libelle              NVARCHAR(100)     NOT NULL,
        Description          NVARCHAR(250)     NULL,
        Actif                BIT               NOT NULL CONSTRAINT DF_CategoriePiece_Actif DEFAULT (1),
        CONSTRAINT PK_CategoriePiece PRIMARY KEY (CategoriePieceID)
    );
END
GO

IF OBJECT_ID(N'garage.Piece', N'U') IS NULL
BEGIN
    CREATE TABLE garage.Piece
    (
        PieceID                INT IDENTITY(1,1) NOT NULL,
        Reference              NVARCHAR(50)      NOT NULL,
        Designation            NVARCHAR(200)     NOT NULL,
        CategoriePieceID       INT               NULL,
        Marque                 NVARCHAR(100)     NULL,
        Unite                  NVARCHAR(20)      NOT NULL CONSTRAINT DF_Piece_Unite DEFAULT (N'U'),
        PrixAchatHT            DECIMAL(18,2)     NOT NULL CONSTRAINT DF_Piece_PrixAchatHT DEFAULT (0),
        PrixVenteHT            DECIMAL(18,2)     NOT NULL CONSTRAINT DF_Piece_PrixVenteHT DEFAULT (0),
        TauxTVA                DECIMAL(5,2)      NOT NULL CONSTRAINT DF_Piece_TauxTVA DEFAULT (0),
        StockActuel            DECIMAL(18,3)     NOT NULL CONSTRAINT DF_Piece_StockActuel DEFAULT (0),
        StockMin               DECIMAL(18,3)     NOT NULL CONSTRAINT DF_Piece_StockMin DEFAULT (0),
        Emplacement            NVARCHAR(100)     NULL,
        CodeBarres             NVARCHAR(100)     NULL,
        FournisseurPrincipalID INT               NULL,
        Notes                  NVARCHAR(1000)    NULL,
        Actif                  BIT               NOT NULL CONSTRAINT DF_Piece_Actif DEFAULT (1),
        DateCreation           DATETIME2(0)      NOT NULL CONSTRAINT DF_Piece_DateCreation DEFAULT (SYSUTCDATETIME()),
        DateModification       DATETIME2(0)      NULL,
        CONSTRAINT PK_Piece PRIMARY KEY (PieceID),
        CONSTRAINT FK_Piece_CategoriePiece FOREIGN KEY (CategoriePieceID) REFERENCES garage.CategoriePiece(CategoriePieceID),
        CONSTRAINT FK_Piece_FournisseurPrincipal FOREIGN KEY (FournisseurPrincipalID) REFERENCES garage.Fournisseur(FournisseurID),
        CONSTRAINT CK_Piece_PrixAchat CHECK (PrixAchatHT >= 0),
        CONSTRAINT CK_Piece_PrixVente CHECK (PrixVenteHT >= 0),
        CONSTRAINT CK_Piece_TauxTVA CHECK (TauxTVA >= 0 AND TauxTVA <= 100),
        CONSTRAINT CK_Piece_StockActuel CHECK (StockActuel >= 0),
        CONSTRAINT CK_Piece_StockMin CHECK (StockMin >= 0)
    );
END
GO

/* =========================================================
   5) ACHATS FOURNISSEURS
   ========================================================= */

IF OBJECT_ID(N'garage.AchatFournisseur', N'U') IS NULL
BEGIN
    CREATE TABLE garage.AchatFournisseur
    (
        AchatID              INT IDENTITY(1,1) NOT NULL,
        NumeroAchat          NVARCHAR(30)      NOT NULL,
        FournisseurID        INT               NOT NULL,
        StatutAchatID        TINYINT           NOT NULL CONSTRAINT DF_AchatFournisseur_StatutAchatID DEFAULT (1),
        DateAchat            DATE              NOT NULL,
        DateReception        DATE              NULL,
        ReferenceFournisseur NVARCHAR(50)      NULL,
        SousTotalHT          DECIMAL(18,2)     NOT NULL CONSTRAINT DF_AchatFournisseur_SousTotalHT DEFAULT (0),
        Remise               DECIMAL(18,2)     NOT NULL CONSTRAINT DF_AchatFournisseur_Remise DEFAULT (0),
        TVA                  DECIMAL(18,2)     NOT NULL CONSTRAINT DF_AchatFournisseur_TVA DEFAULT (0),
        TotalTTC             DECIMAL(18,2)     NOT NULL CONSTRAINT DF_AchatFournisseur_TotalTTC DEFAULT (0),
        MontantPaye          DECIMAL(18,2)     NOT NULL CONSTRAINT DF_AchatFournisseur_MontantPaye DEFAULT (0),
        MontantRestant       AS (CONVERT(DECIMAL(18,2), TotalTTC - MontantPaye)) PERSISTED,
        Notes                NVARCHAR(1000)    NULL,
        DateCreation         DATETIME2(0)      NOT NULL CONSTRAINT DF_AchatFournisseur_DateCreation DEFAULT (SYSUTCDATETIME()),
        CONSTRAINT PK_AchatFournisseur PRIMARY KEY (AchatID),
        CONSTRAINT FK_AchatFournisseur_Fournisseur FOREIGN KEY (FournisseurID) REFERENCES garage.Fournisseur(FournisseurID),
        CONSTRAINT FK_AchatFournisseur_StatutAchat FOREIGN KEY (StatutAchatID) REFERENCES garage.StatutAchat(StatutAchatID),
        CONSTRAINT CK_AchatFournisseur_Montants CHECK
        (
            SousTotalHT >= 0 AND
            Remise >= 0 AND
            TVA >= 0 AND
            TotalTTC >= 0 AND
            MontantPaye >= 0
        )
    );
END
GO

IF OBJECT_ID(N'garage.AchatFournisseurLigne', N'U') IS NULL
BEGIN
    CREATE TABLE garage.AchatFournisseurLigne
    (
        AchatLigneID         INT IDENTITY(1,1) NOT NULL,
        AchatID              INT               NOT NULL,
        PieceID              INT               NOT NULL,
        Description          NVARCHAR(200)     NULL,
        Quantite             DECIMAL(18,3)     NOT NULL,
        PrixUnitaireHT       DECIMAL(18,2)     NOT NULL,
        RemisePct            DECIMAL(5,2)      NOT NULL CONSTRAINT DF_AchatFournisseurLigne_RemisePct DEFAULT (0),
        TauxTVA              DECIMAL(5,2)      NOT NULL CONSTRAINT DF_AchatFournisseurLigne_TauxTVA DEFAULT (0),
        MontantHT            DECIMAL(18,2)     NOT NULL CONSTRAINT DF_AchatFournisseurLigne_MontantHT DEFAULT (0),
        MontantTVA           DECIMAL(18,2)     NOT NULL CONSTRAINT DF_AchatFournisseurLigne_MontantTVA DEFAULT (0),
        MontantTTC           DECIMAL(18,2)     NOT NULL CONSTRAINT DF_AchatFournisseurLigne_MontantTTC DEFAULT (0),
        CONSTRAINT PK_AchatFournisseurLigne PRIMARY KEY (AchatLigneID),
        CONSTRAINT FK_AchatFournisseurLigne_AchatFournisseur FOREIGN KEY (AchatID) REFERENCES garage.AchatFournisseur(AchatID) ON DELETE CASCADE,
        CONSTRAINT FK_AchatFournisseurLigne_Piece FOREIGN KEY (PieceID) REFERENCES garage.Piece(PieceID),
        CONSTRAINT CK_AchatFournisseurLigne_Quantite CHECK (Quantite > 0),
        CONSTRAINT CK_AchatFournisseurLigne_Prix CHECK (PrixUnitaireHT >= 0),
        CONSTRAINT CK_AchatFournisseurLigne_RemisePct CHECK (RemisePct >= 0 AND RemisePct <= 100),
        CONSTRAINT CK_AchatFournisseurLigne_TauxTVA CHECK (TauxTVA >= 0 AND TauxTVA <= 100)
    );
END
GO

/* =========================================================
   6) ORDRES DE RÉPARATION
   ========================================================= */

IF OBJECT_ID(N'garage.OrdreReparation', N'U') IS NULL
BEGIN
    CREATE TABLE garage.OrdreReparation
    (
        OrdreReparationID    INT IDENTITY(1,1) NOT NULL,
        NumeroOR             NVARCHAR(30)      NOT NULL,
        ClientID             INT               NOT NULL,
        VehiculeID           INT               NOT NULL,
        EmployeID            INT               NULL,
        StatutOrdreID        TINYINT           NOT NULL CONSTRAINT DF_OrdreReparation_StatutOrdreID DEFAULT (1),
        DateEntree           DATETIME2(0)      NOT NULL,
        DateSortiePrevue     DATETIME2(0)      NULL,
        DateCloture          DATETIME2(0)      NULL,
        KilometrageEntree    INT               NOT NULL CONSTRAINT DF_OrdreReparation_KilometrageEntree DEFAULT (0),
        KilometrageSortie    INT               NULL,
        NiveauCarburant      NVARCHAR(20)      NULL,
        Priorite             NVARCHAR(20)      NOT NULL CONSTRAINT DF_OrdreReparation_Priorite DEFAULT (N'Normale'),
        PanneDeclaree        NVARCHAR(MAX)     NULL,
        Diagnostic           NVARCHAR(MAX)     NULL,
        TravauxEffectues     NVARCHAR(MAX)     NULL,
        ObservationEntree    NVARCHAR(MAX)     NULL,
        ObservationSortie    NVARCHAR(MAX)     NULL,
        MontantPiecesHT      DECIMAL(18,2)     NOT NULL CONSTRAINT DF_OrdreReparation_MontantPiecesHT DEFAULT (0),
        MontantMainOeuvreHT  DECIMAL(18,2)     NOT NULL CONSTRAINT DF_OrdreReparation_MontantMainOeuvreHT DEFAULT (0),
        Remise               DECIMAL(18,2)     NOT NULL CONSTRAINT DF_OrdreReparation_Remise DEFAULT (0),
        TVA                  DECIMAL(18,2)     NOT NULL CONSTRAINT DF_OrdreReparation_TVA DEFAULT (0),
        TotalTTC             DECIMAL(18,2)     NOT NULL CONSTRAINT DF_OrdreReparation_TotalTTC DEFAULT (0),
        Acompte              DECIMAL(18,2)     NOT NULL CONSTRAINT DF_OrdreReparation_Acompte DEFAULT (0),
        Notes                NVARCHAR(1000)    NULL,
        DateCreation         DATETIME2(0)      NOT NULL CONSTRAINT DF_OrdreReparation_DateCreation DEFAULT (SYSUTCDATETIME()),
        CONSTRAINT PK_OrdreReparation PRIMARY KEY (OrdreReparationID),
        CONSTRAINT FK_OrdreReparation_Client FOREIGN KEY (ClientID) REFERENCES garage.Client(ClientID),
        CONSTRAINT FK_OrdreReparation_Vehicule FOREIGN KEY (VehiculeID) REFERENCES garage.Vehicule(VehiculeID),
        CONSTRAINT FK_OrdreReparation_Employe FOREIGN KEY (EmployeID) REFERENCES garage.Employe(EmployeID),
        CONSTRAINT FK_OrdreReparation_StatutOrdreReparation FOREIGN KEY (StatutOrdreID) REFERENCES garage.StatutOrdreReparation(StatutOrdreID),
        CONSTRAINT CK_OrdreReparation_Priorite CHECK (Priorite IN (N'Basse', N'Normale', N'Haute', N'Urgente')),
        CONSTRAINT CK_OrdreReparation_KilometrageEntree CHECK (KilometrageEntree >= 0),
        CONSTRAINT CK_OrdreReparation_KilometrageSortie CHECK (KilometrageSortie IS NULL OR KilometrageSortie >= 0),
        CONSTRAINT CK_OrdreReparation_Montants CHECK
        (
            MontantPiecesHT >= 0 AND
            MontantMainOeuvreHT >= 0 AND
            Remise >= 0 AND
            TVA >= 0 AND
            TotalTTC >= 0 AND
            Acompte >= 0
        )
    );
END
GO

IF OBJECT_ID(N'garage.OrdreReparationPiece', N'U') IS NULL
BEGIN
    CREATE TABLE garage.OrdreReparationPiece
    (
        OrdreReparationPieceID INT IDENTITY(1,1) NOT NULL,
        OrdreReparationID      INT               NOT NULL,
        PieceID                INT               NOT NULL,
        DescriptionPiece       NVARCHAR(200)     NULL,
        Quantite               DECIMAL(18,3)     NOT NULL,
        PrixUnitaireHT         DECIMAL(18,2)     NOT NULL,
        RemisePct              DECIMAL(5,2)      NOT NULL CONSTRAINT DF_OrdreReparationPiece_RemisePct DEFAULT (0),
        TauxTVA                DECIMAL(5,2)      NOT NULL CONSTRAINT DF_OrdreReparationPiece_TauxTVA DEFAULT (0),
        MontantHT              DECIMAL(18,2)     NOT NULL CONSTRAINT DF_OrdreReparationPiece_MontantHT DEFAULT (0),
        MontantTVA             DECIMAL(18,2)     NOT NULL CONSTRAINT DF_OrdreReparationPiece_MontantTVA DEFAULT (0),
        MontantTTC             DECIMAL(18,2)     NOT NULL CONSTRAINT DF_OrdreReparationPiece_MontantTTC DEFAULT (0),
        SortieStockEffectuee   BIT               NOT NULL CONSTRAINT DF_OrdreReparationPiece_SortieStockEffectuee DEFAULT (0),
        CONSTRAINT PK_OrdreReparationPiece PRIMARY KEY (OrdreReparationPieceID),
        CONSTRAINT FK_OrdreReparationPiece_OrdreReparation FOREIGN KEY (OrdreReparationID) REFERENCES garage.OrdreReparation(OrdreReparationID) ON DELETE CASCADE,
        CONSTRAINT FK_OrdreReparationPiece_Piece FOREIGN KEY (PieceID) REFERENCES garage.Piece(PieceID),
        CONSTRAINT CK_OrdreReparationPiece_Quantite CHECK (Quantite > 0),
        CONSTRAINT CK_OrdreReparationPiece_Prix CHECK (PrixUnitaireHT >= 0),
        CONSTRAINT CK_OrdreReparationPiece_RemisePct CHECK (RemisePct >= 0 AND RemisePct <= 100),
        CONSTRAINT CK_OrdreReparationPiece_TauxTVA CHECK (TauxTVA >= 0 AND TauxTVA <= 100)
    );
END
GO

IF OBJECT_ID(N'garage.OrdreReparationMainOeuvre', N'U') IS NULL
BEGIN
    CREATE TABLE garage.OrdreReparationMainOeuvre
    (
        OrdreReparationMainOeuvreID INT IDENTITY(1,1) NOT NULL,
        OrdreReparationID           INT               NOT NULL,
        Libelle                     NVARCHAR(200)     NOT NULL,
        Heures                      DECIMAL(10,2)     NULL,
        TarifHoraireHT              DECIMAL(18,2)     NULL,
        MontantForfaitHT            DECIMAL(18,2)     NULL,
        TauxTVA                     DECIMAL(5,2)      NOT NULL CONSTRAINT DF_OrdreReparationMainOeuvre_TauxTVA DEFAULT (0),
        MontantHT                   DECIMAL(18,2)     NOT NULL CONSTRAINT DF_OrdreReparationMainOeuvre_MontantHT DEFAULT (0),
        MontantTVA                  DECIMAL(18,2)     NOT NULL CONSTRAINT DF_OrdreReparationMainOeuvre_MontantTVA DEFAULT (0),
        MontantTTC                  DECIMAL(18,2)     NOT NULL CONSTRAINT DF_OrdreReparationMainOeuvre_MontantTTC DEFAULT (0),
        Observation                 NVARCHAR(500)     NULL,
        CONSTRAINT PK_OrdreReparationMainOeuvre PRIMARY KEY (OrdreReparationMainOeuvreID),
        CONSTRAINT FK_OrdreReparationMainOeuvre_OrdreReparation FOREIGN KEY (OrdreReparationID) REFERENCES garage.OrdreReparation(OrdreReparationID) ON DELETE CASCADE,
        CONSTRAINT CK_OrdreReparationMainOeuvre_Heures CHECK (Heures IS NULL OR Heures >= 0),
        CONSTRAINT CK_OrdreReparationMainOeuvre_TarifHoraireHT CHECK (TarifHoraireHT IS NULL OR TarifHoraireHT >= 0),
        CONSTRAINT CK_OrdreReparationMainOeuvre_MontantForfaitHT CHECK (MontantForfaitHT IS NULL OR MontantForfaitHT >= 0),
        CONSTRAINT CK_OrdreReparationMainOeuvre_TauxTVA CHECK (TauxTVA >= 0 AND TauxTVA <= 100)
    );
END
GO

/* =========================================================
   7) FACTURATION
   ========================================================= */

IF OBJECT_ID(N'garage.Facture', N'U') IS NULL
BEGIN
    CREATE TABLE garage.Facture
    (
        FactureID             INT IDENTITY(1,1) NOT NULL,
        NumeroFacture         NVARCHAR(30)      NOT NULL,
        OrdreReparationID     INT               NULL,
        ClientID              INT               NOT NULL,
        VehiculeID            INT               NULL,
        StatutFactureID       TINYINT           NOT NULL CONSTRAINT DF_Facture_StatutFactureID DEFAULT (1),
        ModePaiementID        TINYINT           NULL,
        DateFacture           DATE              NOT NULL,
        DateEcheance          DATE              NULL,
        ReferenceExterne      NVARCHAR(50)      NULL,
        Devise                NVARCHAR(10)      NOT NULL CONSTRAINT DF_Facture_Devise DEFAULT (N'DZD'),
        SousTotalHT           DECIMAL(18,2)     NOT NULL CONSTRAINT DF_Facture_SousTotalHT DEFAULT (0),
        Remise                DECIMAL(18,2)     NOT NULL CONSTRAINT DF_Facture_Remise DEFAULT (0),
        TVA                   DECIMAL(18,2)     NOT NULL CONSTRAINT DF_Facture_TVA DEFAULT (0),
        Timbre                DECIMAL(18,2)     NOT NULL CONSTRAINT DF_Facture_Timbre DEFAULT (0),
        TotalTTC              DECIMAL(18,2)     NOT NULL CONSTRAINT DF_Facture_TotalTTC DEFAULT (0),
        MontantPaye           DECIMAL(18,2)     NOT NULL CONSTRAINT DF_Facture_MontantPaye DEFAULT (0),
        ResteAPayer           AS (CONVERT(DECIMAL(18,2), TotalTTC - MontantPaye)) PERSISTED,
        Observation           NVARCHAR(1000)    NULL,
        DateCreation          DATETIME2(0)      NOT NULL CONSTRAINT DF_Facture_DateCreation DEFAULT (SYSUTCDATETIME()),
        CONSTRAINT PK_Facture PRIMARY KEY (FactureID),
        CONSTRAINT FK_Facture_OrdreReparation FOREIGN KEY (OrdreReparationID) REFERENCES garage.OrdreReparation(OrdreReparationID),
        CONSTRAINT FK_Facture_Client FOREIGN KEY (ClientID) REFERENCES garage.Client(ClientID),
        CONSTRAINT FK_Facture_Vehicule FOREIGN KEY (VehiculeID) REFERENCES garage.Vehicule(VehiculeID),
        CONSTRAINT FK_Facture_StatutFacture FOREIGN KEY (StatutFactureID) REFERENCES garage.StatutFacture(StatutFactureID),
        CONSTRAINT FK_Facture_ModePaiement FOREIGN KEY (ModePaiementID) REFERENCES garage.ModePaiement(ModePaiementID),
        CONSTRAINT CK_Facture_Montants CHECK
        (
            SousTotalHT >= 0 AND
            Remise >= 0 AND
            TVA >= 0 AND
            Timbre >= 0 AND
            TotalTTC >= 0 AND
            MontantPaye >= 0
        )
    );
END
GO

IF OBJECT_ID(N'garage.FactureLigne', N'U') IS NULL
BEGIN
    CREATE TABLE garage.FactureLigne
    (
        FactureLigneID              INT IDENTITY(1,1) NOT NULL,
        FactureID                   INT               NOT NULL,
        TypeLigne                   NVARCHAR(20)      NOT NULL,
        PieceID                     INT               NULL,
        OrdreReparationPieceID      INT               NULL,
        OrdreReparationMainOeuvreID INT               NULL,
        Description                 NVARCHAR(250)     NOT NULL,
        Quantite                    DECIMAL(18,3)     NOT NULL,
        PrixUnitaireHT              DECIMAL(18,2)     NOT NULL,
        RemisePct                   DECIMAL(5,2)      NOT NULL CONSTRAINT DF_FactureLigne_RemisePct DEFAULT (0),
        TauxTVA                     DECIMAL(5,2)      NOT NULL CONSTRAINT DF_FactureLigne_TauxTVA DEFAULT (0),
        MontantHT                   DECIMAL(18,2)     NOT NULL CONSTRAINT DF_FactureLigne_MontantHT DEFAULT (0),
        MontantTVA                  DECIMAL(18,2)     NOT NULL CONSTRAINT DF_FactureLigne_MontantTVA DEFAULT (0),
        MontantTTC                  DECIMAL(18,2)     NOT NULL CONSTRAINT DF_FactureLigne_MontantTTC DEFAULT (0),
        CONSTRAINT PK_FactureLigne PRIMARY KEY (FactureLigneID),
        CONSTRAINT FK_FactureLigne_Facture FOREIGN KEY (FactureID) REFERENCES garage.Facture(FactureID) ON DELETE CASCADE,
        CONSTRAINT FK_FactureLigne_Piece FOREIGN KEY (PieceID) REFERENCES garage.Piece(PieceID),
        CONSTRAINT FK_FactureLigne_OrdreReparationPiece FOREIGN KEY (OrdreReparationPieceID) REFERENCES garage.OrdreReparationPiece(OrdreReparationPieceID),
        CONSTRAINT FK_FactureLigne_OrdreReparationMainOeuvre FOREIGN KEY (OrdreReparationMainOeuvreID) REFERENCES garage.OrdreReparationMainOeuvre(OrdreReparationMainOeuvreID),
        CONSTRAINT CK_FactureLigne_TypeLigne CHECK (TypeLigne IN (N'Pièce', N'MainOeuvre', N'Service', N'Divers')),
        CONSTRAINT CK_FactureLigne_Quantite CHECK (Quantite > 0),
        CONSTRAINT CK_FactureLigne_Prix CHECK (PrixUnitaireHT >= 0),
        CONSTRAINT CK_FactureLigne_RemisePct CHECK (RemisePct >= 0 AND RemisePct <= 100),
        CONSTRAINT CK_FactureLigne_TauxTVA CHECK (TauxTVA >= 0 AND TauxTVA <= 100)
    );
END
GO

IF OBJECT_ID(N'garage.PaiementFacture', N'U') IS NULL
BEGIN
    CREATE TABLE garage.PaiementFacture
    (
        PaiementFactureID      INT IDENTITY(1,1) NOT NULL,
        FactureID              INT               NOT NULL,
        ModePaiementID         TINYINT           NOT NULL,
        DatePaiement           DATETIME2(0)      NOT NULL,
        Montant                DECIMAL(18,2)     NOT NULL,
        ReferencePaiement      NVARCHAR(100)     NULL,
        Observation            NVARCHAR(500)     NULL,
        DateCreation           DATETIME2(0)      NOT NULL CONSTRAINT DF_PaiementFacture_DateCreation DEFAULT (SYSUTCDATETIME()),
        CONSTRAINT PK_PaiementFacture PRIMARY KEY (PaiementFactureID),
        CONSTRAINT FK_PaiementFacture_Facture FOREIGN KEY (FactureID) REFERENCES garage.Facture(FactureID) ON DELETE CASCADE,
        CONSTRAINT FK_PaiementFacture_ModePaiement FOREIGN KEY (ModePaiementID) REFERENCES garage.ModePaiement(ModePaiementID),
        CONSTRAINT CK_PaiementFacture_Montant CHECK (Montant > 0)
    );
END
GO

/* =========================================================
   8) INVENTAIRE ET MOUVEMENTS DE STOCK
   ========================================================= */

IF OBJECT_ID(N'garage.InventaireStock', N'U') IS NULL
BEGIN
    CREATE TABLE garage.InventaireStock
    (
        InventaireID          INT IDENTITY(1,1) NOT NULL,
        NumeroInventaire      NVARCHAR(30)      NOT NULL,
        DateInventaire        DATE              NOT NULL,
        Commentaire           NVARCHAR(500)     NULL,
        DateCreation          DATETIME2(0)      NOT NULL CONSTRAINT DF_InventaireStock_DateCreation DEFAULT (SYSUTCDATETIME()),
        CONSTRAINT PK_InventaireStock PRIMARY KEY (InventaireID)
    );
END
GO

IF OBJECT_ID(N'garage.InventaireStockLigne', N'U') IS NULL
BEGIN
    CREATE TABLE garage.InventaireStockLigne
    (
        InventaireLigneID     INT IDENTITY(1,1) NOT NULL,
        InventaireID          INT               NOT NULL,
        PieceID               INT               NOT NULL,
        StockTheorique        DECIMAL(18,3)     NOT NULL CONSTRAINT DF_InventaireStockLigne_StockTheorique DEFAULT (0),
        StockCompte           DECIMAL(18,3)     NOT NULL CONSTRAINT DF_InventaireStockLigne_StockCompte DEFAULT (0),
        Ecart                 AS (CONVERT(DECIMAL(18,3), StockCompte - StockTheorique)) PERSISTED,
        Observation           NVARCHAR(250)     NULL,
        CONSTRAINT PK_InventaireStockLigne PRIMARY KEY (InventaireLigneID),
        CONSTRAINT FK_InventaireStockLigne_InventaireStock FOREIGN KEY (InventaireID) REFERENCES garage.InventaireStock(InventaireID) ON DELETE CASCADE,
        CONSTRAINT FK_InventaireStockLigne_Piece FOREIGN KEY (PieceID) REFERENCES garage.Piece(PieceID),
        CONSTRAINT CK_InventaireStockLigne_Stocks CHECK (StockTheorique >= 0 AND StockCompte >= 0)
    );
END
GO

IF OBJECT_ID(N'garage.MouvementStock', N'U') IS NULL
BEGIN
    CREATE TABLE garage.MouvementStock
    (
        MouvementStockID        INT IDENTITY(1,1) NOT NULL,
        PieceID                 INT               NOT NULL,
        TypeMouvementStockID    TINYINT           NOT NULL,
        DateMouvement           DATETIME2(0)      NOT NULL,
        Quantite                DECIMAL(18,3)     NOT NULL,
        AchatLigneID            INT               NULL,
        OrdreReparationPieceID  INT               NULL,
        FactureLigneID          INT               NULL,
        InventaireLigneID       INT               NULL,
        ReferenceDocument       NVARCHAR(50)      NULL,
        Commentaire             NVARCHAR(500)     NULL,
        DateCreation            DATETIME2(0)      NOT NULL CONSTRAINT DF_MouvementStock_DateCreation DEFAULT (SYSUTCDATETIME()),
        CONSTRAINT PK_MouvementStock PRIMARY KEY (MouvementStockID),
        CONSTRAINT FK_MouvementStock_Piece FOREIGN KEY (PieceID) REFERENCES garage.Piece(PieceID),
        CONSTRAINT FK_MouvementStock_TypeMouvementStock FOREIGN KEY (TypeMouvementStockID) REFERENCES garage.TypeMouvementStock(TypeMouvementStockID),
        CONSTRAINT FK_MouvementStock_AchatFournisseurLigne FOREIGN KEY (AchatLigneID) REFERENCES garage.AchatFournisseurLigne(AchatLigneID),
        CONSTRAINT FK_MouvementStock_OrdreReparationPiece FOREIGN KEY (OrdreReparationPieceID) REFERENCES garage.OrdreReparationPiece(OrdreReparationPieceID),
        CONSTRAINT FK_MouvementStock_FactureLigne FOREIGN KEY (FactureLigneID) REFERENCES garage.FactureLigne(FactureLigneID),
        CONSTRAINT FK_MouvementStock_InventaireStockLigne FOREIGN KEY (InventaireLigneID) REFERENCES garage.InventaireStockLigne(InventaireLigneID),
        CONSTRAINT CK_MouvementStock_Quantite CHECK (Quantite > 0)
    );
END
GO

/* =========================================================
   9) CONTRAINTES D’UNICITÉ / INDEX UNIQUES
   ========================================================= */

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'UX_Client_CodeClient' AND object_id = OBJECT_ID(N'garage.Client'))
BEGIN
    CREATE UNIQUE INDEX UX_Client_CodeClient
        ON garage.Client(CodeClient)
        WHERE CodeClient IS NOT NULL;
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'UX_Fournisseur_CodeFournisseur' AND object_id = OBJECT_ID(N'garage.Fournisseur'))
BEGIN
    CREATE UNIQUE INDEX UX_Fournisseur_CodeFournisseur
        ON garage.Fournisseur(CodeFournisseur)
        WHERE CodeFournisseur IS NOT NULL;
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'UX_Vehicule_Immatriculation' AND object_id = OBJECT_ID(N'garage.Vehicule'))
BEGIN
    CREATE UNIQUE INDEX UX_Vehicule_Immatriculation
        ON garage.Vehicule(Immatriculation);
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'UX_Vehicule_VIN' AND object_id = OBJECT_ID(N'garage.Vehicule'))
BEGIN
    CREATE UNIQUE INDEX UX_Vehicule_VIN
        ON garage.Vehicule(VIN)
        WHERE VIN IS NOT NULL;
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'UX_CategoriePiece_CodeCategorie' AND object_id = OBJECT_ID(N'garage.CategoriePiece'))
BEGIN
    CREATE UNIQUE INDEX UX_CategoriePiece_CodeCategorie
        ON garage.CategoriePiece(CodeCategorie)
        WHERE CodeCategorie IS NOT NULL;
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'UX_Piece_Reference' AND object_id = OBJECT_ID(N'garage.Piece'))
BEGIN
    CREATE UNIQUE INDEX UX_Piece_Reference
        ON garage.Piece(Reference);
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'UX_AchatFournisseur_NumeroAchat' AND object_id = OBJECT_ID(N'garage.AchatFournisseur'))
BEGIN
    CREATE UNIQUE INDEX UX_AchatFournisseur_NumeroAchat
        ON garage.AchatFournisseur(NumeroAchat);
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'UX_OrdreReparation_NumeroOR' AND object_id = OBJECT_ID(N'garage.OrdreReparation'))
BEGIN
    CREATE UNIQUE INDEX UX_OrdreReparation_NumeroOR
        ON garage.OrdreReparation(NumeroOR);
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'UX_Facture_NumeroFacture' AND object_id = OBJECT_ID(N'garage.Facture'))
BEGIN
    CREATE UNIQUE INDEX UX_Facture_NumeroFacture
        ON garage.Facture(NumeroFacture);
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'UX_InventaireStock_NumeroInventaire' AND object_id = OBJECT_ID(N'garage.InventaireStock'))
BEGIN
    CREATE UNIQUE INDEX UX_InventaireStock_NumeroInventaire
        ON garage.InventaireStock(NumeroInventaire);
END
GO

/* =========================================================
   10) INDEX DE PERFORMANCE
   ========================================================= */

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_Vehicule_ClientID' AND object_id = OBJECT_ID(N'garage.Vehicule'))
BEGIN
    CREATE INDEX IX_Vehicule_ClientID
        ON garage.Vehicule(ClientID);
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_Piece_CategoriePieceID' AND object_id = OBJECT_ID(N'garage.Piece'))
BEGIN
    CREATE INDEX IX_Piece_CategoriePieceID
        ON garage.Piece(CategoriePieceID);
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_Piece_FournisseurPrincipalID' AND object_id = OBJECT_ID(N'garage.Piece'))
BEGIN
    CREATE INDEX IX_Piece_FournisseurPrincipalID
        ON garage.Piece(FournisseurPrincipalID);
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_AchatFournisseur_FournisseurID_DateAchat' AND object_id = OBJECT_ID(N'garage.AchatFournisseur'))
BEGIN
    CREATE INDEX IX_AchatFournisseur_FournisseurID_DateAchat
        ON garage.AchatFournisseur(FournisseurID, DateAchat);
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_AchatFournisseurLigne_AchatID' AND object_id = OBJECT_ID(N'garage.AchatFournisseurLigne'))
BEGIN
    CREATE INDEX IX_AchatFournisseurLigne_AchatID
        ON garage.AchatFournisseurLigne(AchatID);
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_AchatFournisseurLigne_PieceID' AND object_id = OBJECT_ID(N'garage.AchatFournisseurLigne'))
BEGIN
    CREATE INDEX IX_AchatFournisseurLigne_PieceID
        ON garage.AchatFournisseurLigne(PieceID);
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_OrdreReparation_ClientID' AND object_id = OBJECT_ID(N'garage.OrdreReparation'))
BEGIN
    CREATE INDEX IX_OrdreReparation_ClientID
        ON garage.OrdreReparation(ClientID);
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_OrdreReparation_VehiculeID' AND object_id = OBJECT_ID(N'garage.OrdreReparation'))
BEGIN
    CREATE INDEX IX_OrdreReparation_VehiculeID
        ON garage.OrdreReparation(VehiculeID);
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_OrdreReparation_EmployeID' AND object_id = OBJECT_ID(N'garage.OrdreReparation'))
BEGIN
    CREATE INDEX IX_OrdreReparation_EmployeID
        ON garage.OrdreReparation(EmployeID);
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_OrdreReparation_StatutOrdreID' AND object_id = OBJECT_ID(N'garage.OrdreReparation'))
BEGIN
    CREATE INDEX IX_OrdreReparation_StatutOrdreID
        ON garage.OrdreReparation(StatutOrdreID);
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_OrdreReparationPiece_OrdreReparationID' AND object_id = OBJECT_ID(N'garage.OrdreReparationPiece'))
BEGIN
    CREATE INDEX IX_OrdreReparationPiece_OrdreReparationID
        ON garage.OrdreReparationPiece(OrdreReparationID);
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_OrdreReparationPiece_PieceID' AND object_id = OBJECT_ID(N'garage.OrdreReparationPiece'))
BEGIN
    CREATE INDEX IX_OrdreReparationPiece_PieceID
        ON garage.OrdreReparationPiece(PieceID);
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_OrdreReparationMainOeuvre_OrdreReparationID' AND object_id = OBJECT_ID(N'garage.OrdreReparationMainOeuvre'))
BEGIN
    CREATE INDEX IX_OrdreReparationMainOeuvre_OrdreReparationID
        ON garage.OrdreReparationMainOeuvre(OrdreReparationID);
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_Facture_ClientID_DateFacture' AND object_id = OBJECT_ID(N'garage.Facture'))
BEGIN
    CREATE INDEX IX_Facture_ClientID_DateFacture
        ON garage.Facture(ClientID, DateFacture);
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_Facture_OrdreReparationID' AND object_id = OBJECT_ID(N'garage.Facture'))
BEGIN
    CREATE INDEX IX_Facture_OrdreReparationID
        ON garage.Facture(OrdreReparationID);
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_Facture_VehiculeID' AND object_id = OBJECT_ID(N'garage.Facture'))
BEGIN
    CREATE INDEX IX_Facture_VehiculeID
        ON garage.Facture(VehiculeID);
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_Facture_StatutFactureID' AND object_id = OBJECT_ID(N'garage.Facture'))
BEGIN
    CREATE INDEX IX_Facture_StatutFactureID
        ON garage.Facture(StatutFactureID);
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_FactureLigne_FactureID' AND object_id = OBJECT_ID(N'garage.FactureLigne'))
BEGIN
    CREATE INDEX IX_FactureLigne_FactureID
        ON garage.FactureLigne(FactureID);
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_PaiementFacture_FactureID_DatePaiement' AND object_id = OBJECT_ID(N'garage.PaiementFacture'))
BEGIN
    CREATE INDEX IX_PaiementFacture_FactureID_DatePaiement
        ON garage.PaiementFacture(FactureID, DatePaiement);
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_MouvementStock_PieceID_DateMouvement' AND object_id = OBJECT_ID(N'garage.MouvementStock'))
BEGIN
    CREATE INDEX IX_MouvementStock_PieceID_DateMouvement
        ON garage.MouvementStock(PieceID, DateMouvement);
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_InventaireStockLigne_InventaireID' AND object_id = OBJECT_ID(N'garage.InventaireStockLigne'))
BEGIN
    CREATE INDEX IX_InventaireStockLigne_InventaireID
        ON garage.InventaireStockLigne(InventaireID);
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_InventaireStockLigne_PieceID' AND object_id = OBJECT_ID(N'garage.InventaireStockLigne'))
BEGIN
    CREATE INDEX IX_InventaireStockLigne_PieceID
        ON garage.InventaireStockLigne(PieceID);
END
GO

/* =========================================================
   11) TRIGGER : RECALCUL AUTOMATIQUE DU STOCK
   ========================================================= */

CREATE OR ALTER TRIGGER garage.trg_MouvementStock_RecalculStock
ON garage.MouvementStock
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    SET NOCOUNT ON;

    ;WITH PiecesAffectees AS
    (
        SELECT DISTINCT PieceID FROM inserted
        UNION
        SELECT DISTINCT PieceID FROM deleted
    ),
    Totaux AS
    (
        SELECT
            ms.PieceID,
            SUM(ms.Quantite * tms.ImpactStock) AS StockCalcule
        FROM garage.MouvementStock ms
        INNER JOIN garage.TypeMouvementStock tms
            ON tms.TypeMouvementStockID = ms.TypeMouvementStockID
        INNER JOIN PiecesAffectees pa
            ON pa.PieceID = ms.PieceID
        GROUP BY ms.PieceID
    )
    UPDATE p
       SET p.StockActuel = ISNULL(t.StockCalcule, 0),
           p.DateModification = SYSUTCDATETIME()
    FROM garage.Piece p
    INNER JOIN PiecesAffectees pa
        ON pa.PieceID = p.PieceID
    LEFT JOIN Totaux t
        ON t.PieceID = p.PieceID;
END
GO
