package com.La.Visual.admin;

import java.util.List;
import java.util.Optional;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;


@Repository
public class admin_repository {
   JdbcClient jdbcClient;
   public admin_repository(JdbcClient jdbcClient) {
      this.jdbcClient = jdbcClient;
   }

   public List<admin> findAll() {
      return jdbcClient.sql("SELECT * FROM admins")
         .query(admin.class)
         .list();
   }

   public Optional<admin> findByEmail(String email) {
      return jdbcClient.sql("SELECT * FROM admins WHERE email = :email")
         .param("email", email)
         .query(admin.class)
         .optional();
   }
   
   public Optional<admin> findById(Integer id) {
      return jdbcClient.sql("SELECT * FROM admins WHERE id = :id")
         .param("id", id)
         .query(admin.class)
         .optional();
   }

   public admin save(admin admins) {
      String sql = """
            INSERT INTO admins (email, name, password)
            VALUES (:email, :name, :password)
        """;

        int rowsAffected = jdbcClient.sql(sql)
            .param("email", admins.email())
            .param("name", admins.name())
            .param("password", admins.password())
            .update();
    
        if (rowsAffected > 0) {
            String selectSql = "SELECT id FROM our_users WHERE email = :email";
            Integer generatedId = jdbcClient.sql(selectSql)
                .param("email", admins.email())
                .query(Integer.class)
                .single();
   
            return admins.withId(generatedId);
        } else {
            throw new IllegalStateException("Failed to insert ADMIN into the database");
        }
   }

   public admin update(admin admins) {
      String sql = """
          UPDATE our_users
          SET name = :name, email = :email, password = :password
          WHERE id = :id
      """;
  
      int rowsAffected = jdbcClient.sql(sql)
          .param("id", admins.id())
          .param("name", admins.name())
          .param("email", admins.email())
          .param("password", admins.password())
          .update();
  
      if (rowsAffected > 0) {
          return admins;
      } else {
          throw new IllegalStateException("Failed to update ADMIN with ID: " + admins.id());
      }
  }

  public void deleteById (Integer id) {
      String sql = "DELETE FROM admins WHERE id = :id";
      int rowsAffected = jdbcClient.sql(sql)
          .param("id", id)
          .update();
  
      if (rowsAffected == 0) {
          throw new IllegalStateException("Failed to delete ADMIN with ID: " + id);
      }
   }

}
