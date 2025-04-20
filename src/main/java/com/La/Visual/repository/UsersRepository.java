package com.La.Visual.repository;


import java.util.List;
import java.util.Optional;

import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

import com.La.Visual.entity.OurUsers;

@Repository
public class UsersRepository {

    private final JdbcClient jdbcClient;

    public UsersRepository(JdbcClient jdbcClient) {
        this.jdbcClient = jdbcClient;
    }

    public Optional<OurUsers> findByEmail(String email) {
        return jdbcClient.sql("SELECT * FROM our_users WHERE email = :email")
                .param("email", email)
                .query(OurUsers.class)
                .optional();
    }

    // Ito yung problema sa save since hindi siya nagssave sa database pero di pumapasok sa if since walang .one() sa version ngayon na single() na
    public OurUsers save(OurUsers ourUser) {
        String sql = """
            INSERT INTO our_users (email, name, password, city, role)
            VALUES (:email, :name, :password, :city, :role)
        """;
    
        // Execute the INSERT query
        int rowsAffected = jdbcClient.sql(sql)
            .param("email", ourUser.email())
            .param("name", ourUser.name())
            .param("password", ourUser.password())
            .param("city", ourUser.city())
            .param("role", ourUser.role())
            .update();
    
        if (rowsAffected > 0) {
            // Retrieve the generated ID
            String selectSql = "SELECT id FROM our_users WHERE email = :email";
            Integer generatedId = jdbcClient.sql(selectSql)
                .param("email", ourUser.email())
                .query(Integer.class)
                .single();
    
            // Return a new OurUsers object with the generated ID
            return ourUser.withId(generatedId);
        } else {
            throw new IllegalStateException("Failed to insert user into the database");
        }
    }

    public List<OurUsers> findAll() {
        return jdbcClient.sql("SELECT * FROM our_users")
                .query(OurUsers.class)
                .list();
    }

    public Optional<OurUsers> findById(Integer id) {
        return jdbcClient.sql("SELECT * FROM our_users WHERE id = :id")
                .param("id", id)
                .query(OurUsers.class)
                .optional();
    }

    public void deleteById(Integer id) {
        jdbcClient.sql("DELETE FROM our_users WHERE id = :id")
                .param("id", id)
                .update();
    }

    public OurUsers update(OurUsers ourUser) {
        String sql = """
            UPDATE our_users
            SET name = :name, email = :email, password = :password, city = :city, role = :role
            WHERE id = :id
        """;
    
        int rowsAffected = jdbcClient.sql(sql)
            .param("id", ourUser.id())
            .param("name", ourUser.name())
            .param("email", ourUser.email())
            .param("password", ourUser.password())
            .param("city", ourUser.city())
            .param("role", ourUser.role())
            .update();
    
        if (rowsAffected > 0) {
            return ourUser;
        } else {
            throw new IllegalStateException("Failed to update user with ID: " + ourUser.id());
        }
    }

}
