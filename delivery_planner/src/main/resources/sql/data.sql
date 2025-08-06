DELETE FROM user_roles;
DELETE FROM orders;
DELETE FROM users;
DELETE FROM address;


CREATE OR REPLACE FUNCTION populate_database()
RETURNS void AS $$
DECLARE
    i INTEGER;
    j INTEGER;
    random_desc TEXT;
    user_rec RECORD;
    address_count INTEGER := 20;
    user_count INTEGER := 20;
    order_count INTEGER := 40;
    random_index INTEGER;
    descriptions TEXT[] := ARRAY[
        '1 x paine',
        '2kg x castraveti',
        '5 x oua',
        '3 x lapte',
        '1 x telemea',
        '2 x rosii',
        '4 x mere',
        '6 x lapte',
        '1 x ulei',
        '1 x bere',
        '2 x unt',
        '3 x parizer',
        '2 x banane',
        '1 x ciocolata',
        '1 x pizza mica',
        '3 x batoane cereale',
        '2 x pateu',
        '1 x iaurt',
        '1 x detergent'
        ];
    descr_count INTEGER := array_length(descriptions, 1);

BEGIN

    FOR i IN 1..address_count LOOP
        INSERT INTO address(latitude, longitude)
        VALUES (
            random() * 180 - 90,
            random() * 360 - 180
        );
    END LOOP;

    FOR i IN 1..user_count LOOP
        INSERT INTO users(username, password_hash, address_id)
        VALUES (
            'user' || floor(random() * 10000)::TEXT,
            '$2a$10$WPbBihD0I1vXqzANVfX5c.RpriFcD31DhRup8SOHGqWBPNlcbt/1K', --"parola_tuturor"
            CASE
                WHEN random() > 0.3 THEN
                    (SELECT id FROM address ORDER BY random() LIMIT 1)
                ELSE
                    NULL
            END
        );
    END LOOP;

    FOR user_rec IN (SELECT id FROM users) LOOP
        IF random() > 0.1 THEN
            INSERT INTO user_roles(user_id, role_id)
            VALUES (
                user_rec.id,
                floor(random() * 3 + 1)::INT
            )
            ON CONFLICT DO NOTHING;
        END IF;

        IF random() > 0.7 THEN
            INSERT INTO user_roles(user_id, role_id)
            VALUES (
                user_rec.id,
                floor(random() * 3 + 1)::INT
            )
            ON CONFLICT DO NOTHING;
        END IF;

        IF random() > 0.9 THEN
            INSERT INTO user_roles(user_id, role_id)
            VALUES (
                user_rec.id,
                floor(random() * 3 + 1)::INT
            )
            ON CONFLICT DO NOTHING;
        END IF;
    END LOOP;

    FOR i IN 1..order_count LOOP
        random_index := floor(random() * descr_count)::INT + 1;
        random_desc := descriptions[random_index];

        IF random() > 0.4 THEN
            INSERT INTO orders(
                id_courier,
                id_client,
                address_id,
                description,
                status_id
            ) VALUES (
                (SELECT id FROM users ORDER BY random() LIMIT 1),
                (SELECT id FROM users ORDER BY random() LIMIT 1),
                (SELECT id FROM address ORDER BY random() LIMIT 1),
                random_desc,
                floor(random() * 2 + 2)::INT  -- valoare 2 sau 3
            );
        ELSE
            INSERT INTO orders(
                id_courier,
                id_client,
                address_id,
                description,
                status_id
            ) VALUES (
                NULL,
                (SELECT id FROM users ORDER BY random() LIMIT 1),
                (SELECT id FROM address ORDER BY random() LIMIT 1),
                random_desc,
                1  -- unallocated
            );
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;


select * from users;

SELECT populate_database();
