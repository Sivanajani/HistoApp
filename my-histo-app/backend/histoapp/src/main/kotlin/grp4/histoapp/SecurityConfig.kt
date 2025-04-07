package grp4.histoapp

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.web.SecurityFilterChain

@Configuration
@EnableMethodSecurity
class SecurityConfig {

    @Bean
    fun securityFilterChain(http: HttpSecurity): SecurityFilterChain {
        http
            .authorizeHttpRequests { authz ->
                authz
                    .requestMatchers("/public/**").permitAll() // Optional: frei zugängliche Routen
                    .anyRequest().authenticated() // Alle anderen Routen brauchen gültigen Token
            }
            .oauth2ResourceServer { it.jwt() }

        return http.build()
    }
}
