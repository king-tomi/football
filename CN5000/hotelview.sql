/*Ceate Tables */

CREATE TABLE Hotel (
    Hotel_ID INT PRIMARY KEY,
    Name VARCHAR(50),
    Location VARCHAR(50)
);

CREATE TABLE Staff (
    Staff_ID INT PRIMARY KEY,
    Name VARCHAR(50),
    Designation VARCHAR(50),
    Function VARCHAR(50),
    Hotel_ID INT,
    FOREIGN KEY (Hotel_ID) REFERENCES Hotel(Hotel_ID)
);

CREATE TABLE Appointment (
    Appointment_ID INT PRIMARY KEY,
    Appointment_Date DATE CHECK (Appointment_Date >= CURRENT_DATE)
);

CREATE TABLE Customer (
    Customer_ID INT PRIMARY KEY,
    Name VARCHAR(50) CHECK (Name NOT LIKE '%[0-9]%'),
    Contact VARCHAR(20),
    Booking_Type VARCHAR(50),
    Email VARCHAR(100) CHECK (Email LIKE '%@%') DEFAULT 'unknown@gmail.com'
    Agent_ID INT,
    FOREIGN KEY (Agent_ID) REFERENCES Agent(Agent_ID)
);

CREATE TABLE Agent (
    Agent_ID INT PRIMARY KEY,
    Name VARCHAR(50) CHECK (Name NOT LIKE '%[0-9]%'),
    Level VARCHAR(20) CHECK (Level IN ('Gold', 'Silver', 'Bronze')),
    City VARCHAR(50),
    NumberBookings INT
);

CREATE TABLE Reservation (
    Reservation_ID INT PRIMARY KEY,

    Reservation_Type VARCHAR(20), -- Type of reservation (Room, Dining, Spa, Event)
    Room_Type VARCHAR(50),        -- For Room reservations
    Dining_Type VARCHAR(50),      -- For Dining reservations
    Spa_Type VARCHAR(50),         -- For Spa reservations
    Event_Type VARCHAR(50),       -- For Event bookings
    Customer_ID INT,                 -- Foreign key to Guest table
    CONSTRAINT fk_guest FOREIGN KEY (Customer_ID) REFERENCES Customer(Customer_ID)
);

CREATE TABLE Inventory (
    Item_ID INT PRIMARY KEY,
    Item_Name VARCHAR(100),
    Item_Type VARCHAR(50),
    Quantity INT,
    Price DECIMAL(10, 2),
    Purchased_Date DATE,
    Reservation_ID INT,
    Expiry_Date DATE,
    Description TEXT,
    FOREIGN KEY (Reservation_ID) REFERENCES Reservation(Reservation_ID)
);

ALTER TABLE Agent ADD CONSTRAINT Check_Level
    CHECK (Level = 
        CASE 
            WHEN NumberBookings >= 15 THEN 'Gold'
            WHEN NumberBookings > 10 AND NumberBookings < 15 THEN 'Silver'
            ELSE 'Bronze'
        END
    );

/* Create Trigger */
-- Create the Customer_Archive table if it doesn't exist
CREATE TABLE IF NOT EXISTS Customer_Archive (
    Customer_ID INT PRIMARY KEY,
    Name VARCHAR(50),
    Contact VARCHAR(20),
    Booking_Type VARCHAR(50),
    Email VARCHAR(100),
    Agent_ID INT
);

-- Create the trigger
CREATE TRIGGER archive_deleted_customer
AFTER DELETE ON Customer
FOR EACH ROW
BEGIN
    INSERT INTO Customer_Archive (Customer_ID, Name, Contact, Booking_Type, Email, Agent_ID)
    VALUES (OLD.Customer_ID, OLD.Name, OLD.Contact, OLD.Booking_Type, OLD.Email, OLD.Agent_ID);
END;

/* SQL queries */
-- 1. Retrieve the names of all guests who have made dining reservations at Skyview Hotel in London, along with the reservation dates and total costs
SELECT C.Name AS Guest_Name, R.Reservation_ID, R.Reservation_Date, SUM(I.Price) AS Total_Cost
FROM Customer C
JOIN Reservation R ON C.Customer_ID = R.Customer_ID
JOIN Inventory I ON R.Reservation_ID = I.Reservation_ID
WHERE R.Dining_Type IS NOT NULL AND C.Agent_ID IN (
    SELECT Agent_ID FROM Agent WHERE City = 'London'
)
GROUP BY C.Name, R.Reservation_ID, R.Reservation_Date;

    -- 2. List all staff members at Skyview Hotel, including their names, positions, and salaries, sorted by their job positions
    SELECT S.Name AS Staff_Name, S.Designation, S.Function, S.Salary
    FROM Staff S
    JOIN Hotel H ON S.Hotel_ID = H.Hotel_ID
    ORDER BY S.Designation;

    -- 3. Retrieve the total cost and reservation details for all spa reservations made by a specific guest (identified by their Guest/customer id)
    CREATE FUNCTION GetTotalSpaReservationCost(specific_customer_id INT)
    RETURNS TABLE
    AS
    BEGIN
        RETURN (
            SELECT R.Reservation_ID, R.Reservation_Type, SUM(I.Price) AS Total_Cost
            FROM Reservation R
            JOIN Inventory I ON R.Reservation_ID = I.Reservation_ID
            WHERE R.Spa_Type IS NOT NULL AND R.Customer_ID = specific_customer_id
            GROUP BY R.Reservation_ID, R.Reservation_Type
        );
    END

    SELECT * FROM GetTotalSpaReservationCost(1);

    -- 4. Find the most frequently booked room type at Skyview Hotel and the total number of reservations for that room type
    SELECT Room_Type, COUNT(*) AS Total_Reservations
    FROM Reservation
    WHERE Room_Type IS NOT NULL
    GROUP BY Room_Type
    ORDER BY COUNT(*) DESC
    LIMIT 1;

    -- 5. Display the inventory items used in dining reservations for a specific dining reservation (identified by ReservationID)
    CREATE PROCEDURE GetDiningItemsByReservationID
        @SpecificReservationID INT
    AS
    BEGIN
        SELECT I.Item_Name, I.Item_Type, I.Quantity, I.Price
        FROM Inventory I
        JOIN Reservation R ON I.Reservation_ID = R.Reservation_ID
        WHERE R.Reservation_ID = @SpecificReservationID AND R.Dining_Type IS NOT NULL;
    END;

    EXEC GetDiningItemsByReservationID @SpecificReservationID = [3];


    -- 6. Calculate the total revenue generated from room reservations for a specific date range, along with the number of reservations made during that period along with the agent details
    SELECT SUM(I.Price) AS Total_Revenue, COUNT(*) AS Total_Reservations, A.Agent_ID, A.Name AS Agent_Name
    FROM Reservation R
    JOIN Inventory I ON R.Reservation_ID = I.Reservation_ID
    JOIN Customer C ON R.Customer_ID = C.Customer_ID
    JOIN Agent A ON C.Agent_ID = A.Agent_ID
    WHERE R.Reservation_Type = 'Room' AND R.Reservation_Date BETWEEN 'start_date' AND 'end_date'
    GROUP BY A.Agent_ID, A.Name;

    -- 7. Develop a recommendation system that suggests room upgrades to guests based on their past reservation history and preferences, with the goal of increasing revenue and guest satisfaction
    CREATE PROCEDURE GenerateRoomUpgradeRecommendation
    @CustomerID INT
    AS
    BEGIN
        -- Retrieve past room types booked by the guest
        SELECT DISTINCT Room_Type
        INTO #PastRoomTypes
        FROM Reservation
        WHERE Customer_ID = @CustomerID AND Room_Type IS NOT NULL;

        -- Identify potential room upgrades based on the past room types
        SELECT DISTINCT R.Room_Type AS CurrentRoomType,
            I.Item_Name AS UpgradeTo,
            I.Price AS UpgradeCost
        FROM Inventory I
        JOIN Reservation R ON I.Reservation_ID = R.Reservation_ID
        WHERE R.Customer_ID = @CustomerID
            AND R.Room_Type IS NULL  -- Looking for potential upgrades
            AND EXISTS (
                SELECT 1
                FROM #PastRoomTypes PT
                WHERE PT.Room_Type = R.Room_Type
            );
            
        DROP TABLE IF EXISTS #PastRoomTypes;
    END;

    EXEC GenerateRoomUpgradeRecommendation @CustomerID = [specific_customer_id];

    -- 8. Show the maximum price sold from all Gold and Bronze Agents, for all hotel bookings
    SELECT A.Agent_ID, MAX(I.Price) AS Max_Price
    FROM Agent A
    JOIN Customer C ON A.Agent_ID = C.Agent_ID
    JOIN Reservation R ON C.Customer_ID = R.Customer_ID
    JOIN Inventory I ON R.Reservation_ID = I.Reservation_ID
    WHERE A.Level IN ('Gold', 'Bronze')
    GROUP BY A.Agent_ID;